import os
import sys
import json
import pandas as pd
from io import StringIO, BytesIO
from pathlib import Path
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import tempfile
import traceback

sys.path.insert(0, str(Path(__file__).parent.parent))
from anonymizer import DataAnonymizer

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
MAX_FILE_SIZE = 50 * 1024 * 1024

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def read_file(filepath):
    if filepath.endswith('.csv'):
        return pd.read_csv(filepath)
    else:
        return pd.read_excel(filepath)


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend API running'}), 200


@app.route('/api/preview', methods=['POST'])
def preview_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400

        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        try:
            df = read_file(tmp_path)

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

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/anonymize', methods=['POST'])
def anonymize():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400

        data = request.form
        columns_to_anonymize = json.loads(data.get('columns', '[]'))
        save_mappings = data.get('save_mappings', 'true').lower() == 'true'

        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        try:
            df = read_file(tmp_path)

            if not columns_to_anonymize:
                columns_to_anonymize = df.columns.tolist()

            anonymizer = DataAnonymizer(language='es')

            df_anonymized = anonymizer.anonymize_dataframe(
                df,
                columns_to_anonymize=columns_to_anonymize,
                save_mappings=save_mappings
            )

            stats = {
                'persons': anonymizer.counter.get('person', 0),
                'locations': anonymizer.counter.get('location', 0),
                'ruts': anonymizer.counter.get('rut', 0),
                'emails': anonymizer.counter.get('email', 0),
                'phones': anonymizer.counter.get('phone', 0),
            }

            anonymized_data = df_anonymized.to_dict('records')
            columns = df_anonymized.columns.tolist()
            mappings = anonymizer.mappings if save_mappings else {}

            return jsonify({
                'status': 'success',
                'anonymized_data': anonymized_data,
                'columns': columns,
                'statistics': stats,
                'mappings': mappings,
                'total_mappings': len(mappings)
            }), 200

        finally:
            os.unlink(tmp_path)

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500


@app.route('/api/download/csv', methods=['POST'])
def download_csv():
    try:
        data = request.get_json()
        rows = data.get('data', [])

        if not rows:
            return jsonify({'error': 'No data provided'}), 400

        df = pd.DataFrame(rows)
        buffer = StringIO()
        df.to_csv(buffer, index=False)
        buffer.seek(0)

        return send_file(
            BytesIO(buffer.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name='anonymized-data.csv'
        ), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/download/excel', methods=['POST'])
def download_excel():
    try:
        data = request.get_json()
        rows = data.get('data', [])

        if not rows:
            return jsonify({'error': 'No data provided'}), 400

        df = pd.DataFrame(rows)
        buffer = BytesIO()
        df.to_excel(buffer, index=False)
        buffer.seek(0)

        return send_file(
            buffer,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='anonymized-data.xlsx'
        ), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/download/json', methods=['POST'])
def download_json():
    try:
        data = request.get_json()
        mappings = data.get('mappings', {})

        if not mappings:
            return jsonify({'error': 'No mappings provided'}), 400

        json_data = json.dumps(mappings, ensure_ascii=False, indent=2)
        buffer = BytesIO(json_data.encode())

        return send_file(
            buffer,
            mimetype='application/json',
            as_attachment=True,
            download_name='mappings.json'
        ), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({'error': 'File too large. Max: 50MB'}), 413


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
