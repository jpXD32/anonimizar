import os
import sys
import json
import logging
import pandas as pd
import time
import uuid
from io import StringIO, BytesIO
from pathlib import Path
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import tempfile

sys.path.insert(0, str(Path(__file__).parent.parent))
from anonymizer import DataAnonymizer

app = Flask(__name__)

ALLOWED_ORIGINS = os.environ.get(
    'ALLOWED_ORIGINS',
    'http://localhost:3000,http://127.0.0.1:3000',
)
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS.split(',') if origin.strip()]
CORS(app, resources={r'/api/*': {'origins': ALLOWED_ORIGINS}})
logging.basicConfig(level=os.environ.get('LOG_LEVEL', 'INFO'))
logger = logging.getLogger(__name__)

UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
MAX_FILE_SIZE = 50 * 1024 * 1024
MAX_ROWS = int(os.environ.get('MAX_ROWS', '100000'))
MAX_COLUMNS = int(os.environ.get('MAX_COLUMNS', '200'))
MAX_CELLS = int(os.environ.get('MAX_CELLS', '2000000'))
MAX_DOWNLOAD_ROWS = int(os.environ.get('MAX_DOWNLOAD_ROWS', '100000'))
MAX_JSON_RESPONSE_ROWS = int(os.environ.get('MAX_JSON_RESPONSE_ROWS', '25000'))
MAX_INLINE_RESPONSE_ROWS = int(os.environ.get('MAX_INLINE_RESPONSE_ROWS', '5000'))
PREVIEW_RESPONSE_ROWS = int(os.environ.get('PREVIEW_RESPONSE_ROWS', '100'))
PROCESSING_TIMEOUT_SECONDS = int(os.environ.get('PROCESSING_TIMEOUT_SECONDS', '600'))
RESULT_TTL_SECONDS = int(os.environ.get('RESULT_TTL_SECONDS', '3600'))

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE
RESULT_CACHE = {}


@app.after_request
def add_security_headers(response):
    response.headers['Cache-Control'] = 'no-store'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def validate_file_content(file):
    filename = secure_filename(file.filename)
    extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    header = file.stream.read(8)
    file.stream.seek(0)

    if extension == 'xlsx':
        return header.startswith(b'PK\x03\x04')
    if extension == 'xls':
        return header.startswith(b'\xD0\xCF\x11\xE0')
    if extension == 'csv':
        return b'\x00' not in header

    return False


def error_response(message='Internal server error', status=500):
    return jsonify({'error': message}), status


def validate_columns(columns, available_columns):
    if not isinstance(columns, list):
        raise ValueError('Columns must be a list')

    invalid_columns = [column for column in columns if column not in available_columns]
    if invalid_columns:
        raise ValueError(f'Invalid columns: {", ".join(invalid_columns)}')

    return columns


def sanitize_spreadsheet_cells(rows):
    dangerous_prefixes = ('=', '+', '-', '@')
    sanitized_rows = []

    for row in rows:
        sanitized_row = {}
        for key, value in row.items():
            if isinstance(value, str) and value and value[0] in dangerous_prefixes:
                sanitized_row[key] = f"'{value}"
            else:
                sanitized_row[key] = value
        sanitized_rows.append(sanitized_row)

    return sanitized_rows


def validate_dataframe_size(df):
    rows, columns = df.shape
    cells = rows * columns

    if rows > MAX_ROWS:
        raise ValueError(f'File has too many rows. Max: {MAX_ROWS}')
    if columns > MAX_COLUMNS:
        raise ValueError(f'File has too many columns. Max: {MAX_COLUMNS}')
    if cells > MAX_CELLS:
        raise ValueError(f'File has too many cells. Max: {MAX_CELLS}')


def validate_download_rows(rows):
    if len(rows) > MAX_DOWNLOAD_ROWS:
        raise ValueError(f'Too many rows to export. Max: {MAX_DOWNLOAD_ROWS}')


def read_file(filepath):
    if filepath.endswith('.csv'):
        return pd.read_csv(filepath, dtype=str, keep_default_na=False)
    return pd.read_excel(filepath, dtype=str, keep_default_na=False)


def cleanup_cached_results():
    """Elimina resultados temporales expirados."""
    now = time.monotonic()
    expired_ids = [
        result_id
        for result_id, metadata in RESULT_CACHE.items()
        if now - metadata['created_at'] > RESULT_TTL_SECONDS
    ]
    for result_id in expired_ids:
        metadata = RESULT_CACHE.pop(result_id, None)
        if metadata:
            Path(metadata['path']).unlink(missing_ok=True)


def cache_result_file(df, filename):
    """Guarda un resultado anonimizado para descarga posterior."""
    cleanup_cached_results()
    result_id = uuid.uuid4().hex
    safe_name = secure_filename(filename) or 'anonymized-data.xlsx'
    output_path = Path(tempfile.gettempdir()) / f'anonymized-{result_id}.xlsx'
    df.to_excel(output_path, index=False)
    RESULT_CACHE[result_id] = {
        'path': str(output_path),
        'filename': safe_name,
        'created_at': time.monotonic(),
    }
    return result_id


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend API running'}), 200


@app.route('/api/preview', methods=['POST'])
def preview_file():
    try:
        if 'file' not in request.files:
            return error_response('No file provided', 400)

        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return error_response('Invalid file type', 400)
        if not validate_file_content(file):
            return error_response('Invalid or corrupted file content', 400)

        suffix = Path(secure_filename(file.filename)).suffix.lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        try:
            df = read_file(tmp_path)
            validate_dataframe_size(df)

            preview_data = df.head(10).to_dict('records')
            columns = df.columns.tolist()
            stats = {
                'rows': len(df),
                'columns': len(df.columns),
                'column_names': columns,
                'dtypes': {col: str(df[col].dtype) for col in columns}
            }

            return jsonify({
                'status': 'success',
                'columns': columns,
                'stats': stats,
                'preview': preview_data
            }), 200

        finally:
            os.unlink(tmp_path)

    except ValueError as e:
        return error_response(str(e), 400)
    except Exception:
        logger.exception('Error previewing file')
        return error_response('Error reading file', 500)


@app.route('/api/anonymize', methods=['POST'])
def anonymize():
    try:
        if 'file' not in request.files:
            return error_response('No file provided', 400)

        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return error_response('Invalid file type', 400)
        if not validate_file_content(file):
            return error_response('Invalid or corrupted file content', 400)

        data = request.form
        columns_to_anonymize = json.loads(data.get('columns', '[]'))
        save_mappings = data.get('save_mappings', 'true').lower() == 'true'

        suffix = Path(secure_filename(file.filename)).suffix.lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        try:
            df = read_file(tmp_path)
            validate_dataframe_size(df)

            if not columns_to_anonymize:
                columns_to_anonymize = df.columns.tolist()
            columns_to_anonymize = validate_columns(columns_to_anonymize, df.columns.tolist())

            anonymizer = DataAnonymizer(use_nlp=False)

            df_anonymized = anonymizer.anonymize_dataframe(
                df,
                columns_to_anonymize=columns_to_anonymize,
                timeout_seconds=PROCESSING_TIMEOUT_SECONDS,
            )

            stats = {
                'persons': anonymizer.counter.get('person', 0),
                'locations': anonymizer.counter.get('location', 0),
                'ruts': anonymizer.counter.get('rut', 0),
                'emails': anonymizer.counter.get('email', 0),
                'phones': anonymizer.counter.get('phone', 0),
            }

            columns = df_anonymized.columns.tolist()
            mappings = anonymizer.mappings if save_mappings else {}
            result_download_id = None
            result_truncated = len(df_anonymized) > MAX_INLINE_RESPONSE_ROWS

            if result_truncated:
                result_download_id = cache_result_file(df_anonymized, 'anonymized-data.xlsx')
                anonymized_data = df_anonymized.head(PREVIEW_RESPONSE_ROWS).to_dict('records')
            else:
                anonymized_data = df_anonymized.to_dict('records')

            if len(anonymized_data) > MAX_JSON_RESPONSE_ROWS:
                return error_response(
                    f'Processed data is too large for browser response. Max rows: {MAX_JSON_RESPONSE_ROWS}',
                    413,
                )

            return jsonify({
                'status': 'success',
                'anonymized_data': anonymized_data,
                'columns': columns,
                'statistics': stats,
                'mappings': mappings,
                'total_mappings': len(mappings),
                'result_download_id': result_download_id,
                'result_truncated': result_truncated,
                'preview_rows': len(anonymized_data),
                'total_rows': len(df_anonymized),
            }), 200

        finally:
            os.unlink(tmp_path)

    except TimeoutError:
        return error_response('Processing timeout exceeded', 408)
    except (json.JSONDecodeError, ValueError) as e:
        return error_response(str(e), 400)
    except Exception:
        logger.exception('Error anonymizing file')
        return error_response('Error anonymizing file', 500)


@app.route('/api/download/csv', methods=['POST'])
def download_csv():
    try:
        data = request.get_json()
        rows = data.get('data', [])

        if not rows:
            return error_response('No data provided', 400)
        validate_download_rows(rows)

        df = pd.DataFrame(sanitize_spreadsheet_cells(rows))
        buffer = StringIO()
        df.to_csv(buffer, index=False)
        buffer.seek(0)

        return send_file(
            BytesIO(buffer.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name='anonymized-data.csv'
        ), 200

    except ValueError as e:
        return error_response(str(e), 400)
    except Exception:
        logger.exception('Error generating CSV')
        return error_response('Error generating CSV', 500)


@app.route('/api/download/excel', methods=['POST'])
def download_excel():
    try:
        data = request.get_json()
        rows = data.get('data', [])

        if not rows:
            return error_response('No data provided', 400)
        validate_download_rows(rows)

        df = pd.DataFrame(sanitize_spreadsheet_cells(rows))
        buffer = BytesIO()
        df.to_excel(buffer, index=False)
        buffer.seek(0)

        return send_file(
            buffer,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='anonymized-data.xlsx'
        ), 200

    except ValueError as e:
        return error_response(str(e), 400)
    except Exception:
        logger.exception('Error generating Excel')
        return error_response('Error generating Excel', 500)


@app.route('/api/download/result/<result_id>/<file_format>', methods=['GET'])
def download_cached_result(result_id, file_format):
    """Descarga un resultado anonimizado guardado temporalmente."""
    try:
        cleanup_cached_results()
        metadata = RESULT_CACHE.get(result_id)
        if not metadata:
            return error_response('Processed result expired or not found', 404)

        source_path = Path(metadata['path'])
        if not source_path.exists():
            RESULT_CACHE.pop(result_id, None)
            return error_response('Processed result expired or not found', 404)

        if file_format == 'excel':
            return send_file(
                source_path,
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                as_attachment=True,
                download_name='anonymized-data.xlsx'
            ), 200

        if file_format == 'csv':
            df = pd.read_excel(source_path, dtype=str, keep_default_na=False)
            buffer = StringIO()
            df.to_csv(buffer, index=False)
            buffer.seek(0)
            return send_file(
                BytesIO(buffer.getvalue().encode()),
                mimetype='text/csv',
                as_attachment=True,
                download_name='anonymized-data.csv'
            ), 200

        return error_response('Invalid download format', 400)

    except Exception:
        logger.exception('Error downloading cached result')
        return error_response('Error downloading result', 500)


@app.route('/api/download/json', methods=['POST'])
def download_json():
    try:
        data = request.get_json()
        mappings = data.get('mappings', {})

        if not mappings:
            return error_response('No mappings provided', 400)

        json_data = json.dumps(mappings, ensure_ascii=False, indent=2)
        buffer = BytesIO(json_data.encode())

        return send_file(
            buffer,
            mimetype='application/json',
            as_attachment=True,
            download_name='mappings.json'
        ), 200

    except Exception:
        logger.exception('Error generating mappings JSON')
        return error_response('Error generating mappings JSON', 500)


@app.errorhandler(413)
def request_entity_too_large(error):
    return error_response('File too large. Max: 50MB', 413)


@app.errorhandler(404)
def not_found(error):
    return error_response('Endpoint not found', 404)


@app.errorhandler(500)
def internal_error(error):
    return error_response('Internal server error', 500)


if __name__ == '__main__':
    host = os.environ.get('HOST', '127.0.0.1')
    port = int(os.environ.get('PORT', '5000'))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host=host, port=port, debug=debug)
