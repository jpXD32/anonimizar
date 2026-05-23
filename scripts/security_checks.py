from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def assert_contains(path, text):
    content = read(path)
    assert text in content, f"{path} must contain: {text}"


def assert_not_contains(path, text):
    content = read(path)
    assert text not in content, f"{path} must not contain: {text}"


def main():
    assert_contains("backend/app.py", "127.0.0.1")
    assert_contains("backend/app.py", "CORS(app, resources={r'/api/*'")
    assert_contains("backend/app.py", "Cache-Control")
    assert_contains("backend/app.py", "X-Content-Type-Options")
    assert_contains("backend/app.py", "validate_file_content")
    assert_contains("backend/app.py", "validate_dataframe_size")
    assert_contains("backend/app.py", "PROCESSING_TIMEOUT_SECONDS")
    assert_contains("backend/app.py", "sanitize_spreadsheet_cells")
    assert_not_contains("backend/app.py", "debug=True")
    assert_not_contains("backend/app.py", "0.0.0.0")
    assert_not_contains("backend/app.py", "traceback.format_exc()")

    assert_contains("frontend/next.config.js", "Content-Security-Policy")
    assert_contains("frontend/next.config.js", "Referrer-Policy")
    assert_contains("frontend/next.config.js", "Permissions-Policy")
    assert_contains("frontend/lib/utils.ts", "encryptAndDownloadJson")
    assert_contains("frontend/store/anonymizer.store.ts", "clearSensitiveData")
    assert_contains("frontend/components/anonymizer/FileUpload.tsx", "MAX_FILE_SIZE")
    assert_contains("frontend/components/anonymizer/MappingsViewer.tsx", "Descargar cifrado")

    print("Security checks passed")


if __name__ == "__main__":
    main()
