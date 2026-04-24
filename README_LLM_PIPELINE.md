# LLM Pre-Processing Pipeline

A production-ready Flask web application that converts ZIP archives into LLM-optimized packages by applying the LLM Data-Type Hierarchy to each file.

## Features

- 🖥️ **Drag-and-drop web interface** for easy ZIP uploads
- 🔍 **Intelligent file processing** based on the LLM Data-Type Hierarchy:
  - **Tier S (Passthrough):** Source code, text, JSON, YAML, CSV, XML, HTML, CSS, Markdown → copied as-is
  - **Tier A (→ Markdown):** DOCX, PPTX, XLSX, RTF, ODT → converted to Markdown via Pandoc
  - **Tier C (→ OCR Text):** PNG, JPG, GIF, BMP, PDF → text extracted via OCR (Tesseract)
  - **Tier F (Ignored):** Executables, media files, binaries → excluded from output
- 📄 **Manifest generation:** Creates `_manifest.md` with complete file tree and processing log
- ✅ **Robust error handling:** Comprehensive validation and error recovery
- 🧹 **Automatic cleanup:** Temporary directories cleaned up after each request

## System Requirements

### Operating System
- Linux (Ubuntu/Debian tested)
- macOS (with Homebrew)

### System Dependencies

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y \
    pandoc \
    tesseract-ocr \
    poppler-utils

# macOS (Homebrew)
brew install pandoc tesseract poppler
```

### Python Dependencies

```bash
pip install -r requirements.txt
```

Required Python packages:
- Flask >= 2.3.0
- python-docx >= 0.8.11
- python-pptx >= 0.6.21
- openpyxl >= 3.1.2
- Pillow >= 10.0.0
- pytesseract >= 0.3.10
- pdf2image >= 1.17.0

## Installation & Usage

1. **Install system dependencies:**
   ```bash
   sudo apt-get install -y pandoc tesseract-ocr poppler-utils
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Access the web interface:**
   Open http://localhost:5000 in your browser

5. **Upload and process:**
   - Drag and drop a ZIP file onto the drop zone, or click to select
   - Click "Process ZIP File"
   - Download the LLM-optimized ZIP when ready

## API Endpoints

### `GET /`
Serves the main HTML interface.

### `GET /health`
Health check endpoint. Returns `{"status": "ok"}`.

### `GET /check-deps`
Checks if all system dependencies are installed.

**Response (success):**
```json
{"status": "ok", "missing": []}
```

**Response (missing deps):**
```json
{
  "status": "missing",
  "missing": ["pandoc", "tesseract"],
  "install_cmd": "sudo apt-get install -y pandoc tesseract-ocr poppler-utils"
}
```

### `POST /process`
Processes an uploaded ZIP file.

**Request:**
- Content-Type: `multipart/form-data`
- Form field: `file` (ZIP archive)

**Response (success):**
```json
{
  "success": true,
  "filename": "llm_optimized_archive_20260424_232608.zip",
  "download_url": "/download/llm_optimized_archive_20260424_232608.zip"
}
```

**Response (error):**
```json
{
  "error": "Invalid or corrupted ZIP file"
}
```

**Error Codes:**
- `400` - Bad request (no file, not a ZIP, corrupted ZIP)
- `413` - File too large (>500MB)
- `503` - Missing system dependencies
- `500` - Processing error

### `GET /download/<filename>`
Downloads a processed ZIP file or extracts `_manifest.md`.

To get just the manifest:
```
GET /download/llm_optimized_archive_20260424_232608.zip/_manifest.md
```

## File Processing Details

### Tier S - Raw Text Passthrough
Files are copied without modification. These formats are already optimal for LLM ingestion.

**Extensions:**
- Source code: `.py`, `.js`, `.ts`, `.java`, `.go`, `.rs`, `.c`, `.cpp`, etc.
- Text: `.txt`, `.text`
- Data: `.json`, `.xml`, `.csv`, `.yaml`, `.yml`, `.toml`, `.ini`
- Markup: `.html`, `.css`, `.md`, `.rst`
- SQL: `.sql`, `.graphql`

### Tier A - Document → Markdown
Documents are converted to Markdown using Pandoc, preserving structure (headings, lists, tables).

**Extensions:**
- `.docx`, `.doc` (Word)
- `.pptx`, `.ppt` (PowerPoint)
- `.xlsx`, `.xls` (Excel)
- `.rtf`, `.odt` (OpenDocument)

**Fallback:** If Pandoc fails or produces empty output, Python libraries (`python-docx`, `python-pptx`, `openpyxl`) are used as a fallback.

### Tier C - OCR Text Extraction
Text is extracted from visual formats using OCR.

**Images:** `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.tiff`
- Processed with Tesseract OCR via `pytesseract`

**PDFs:** `.pdf`
- First attempt: Extract text using `pdftotext` (for text-based PDFs)
- Fallback: Convert pages to images using `pdftoppm`, then OCR each image

### Tier F - Ignored/Binary
Files are excluded from the output package and logged in the manifest.

**Examples:**
- Executables: `.exe`, `.msi`, `.bin`
- Archives: `.zip`, `.tar`, `.gz`
- Media: `.mp4`, `.avi`, `.mp3`, `.wav`
- Fonts: `.ttf`, `.otf`, `.woff`
- Databases: `.db`, `.sqlite`

## Output Structure

Processed ZIP files contain:
1. All processed files (Tier S, A, C)
2. `_manifest.md` - Processing report

### Manifest Format

```markdown
# LLM Processing Manifest

**Original ZIP:** `archive.zip`
**Generated:** 2026-04-24 23:26:08
**Total Files Processed:** 15
**Total Output Files:** 12

---

## File Tree

```
├── data.json
├── document.md
├── image.png.txt
└── source.py
```

## Processing Log

| # | Original File | Output File | Action | Status |
|---|--------------|------------|--------|--------|
| 1 | `source.py` | `source.py` | Copied as-is (Tier S) | success |
| 2 | `report.docx` | `report.md` | Converted to Markdown (Tier A) | success |
| 3 | `diagram.png` | `diagram.png.txt` | Text extracted via OCR (Tier C) | success |
| 4 | `video.mp4` | - | Ignored (Binary/Unsupported) | skipped |

---

### Summary

- **Success:** 3
- **Skipped:** 1

---

*Generated by LLM Pre-Processing Pipeline*
```

## Configuration

### Upload Size Limit
The default maximum upload size is 500MB. Modify in `app.py`:

```python
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB
```

### Temporary Directories
Temporary directories are created in:
- `/tmp/llm_pipeline_uploads/` - Uploaded files
- `/tmp/llm_pipeline_extract/` - Extracted ZIP contents
- `/tmp/llm_pipeline_output/` - Processed output (before zipping)

These are automatically cleaned up after each request.

## Error Handling

The application handles errors gracefully:

- **Invalid ZIP files:** Returns 400 with descriptive error
- **Missing dependencies:** Returns 503 with installation instructions
- **File too large:** Returns 413 with size information
- **Processing failures:** Returns 500 with error details, logs to console
- **OCR failures:** Logged in manifest, processing continues

All errors include context for debugging.

## Security Considerations

- File size limit prevents DoS via large uploads
- Filenames are sanitized (path traversal protection)
- Temporary directories use UUIDs to prevent collisions
- No user data is persisted beyond the request lifecycle

**Note:** For production deployment:
- Use a production WSGI server (Gunicorn, uWSGI)
- Add authentication/authorization
- Enable HTTPS
- Implement rate limiting
- Configure proper logging
- Use a reverse proxy (Nginx, Apache)

## Testing

Run the integration test:

```bash
python3 -c "
from app import process_zip, check_system_dependencies
from pathlib import Path
import shutil, zipfile

# Test dependency check
assert check_system_dependencies() == []

# Test full pipeline
output_dir = Path('/tmp/test/output')
output_dir.mkdir(parents=True, exist_ok=True)
zip_path = Path('test.zip')

result = process_zip(zip_path, output_dir)
assert result.exists()

with zipfile.ZipFile(result) as zf:
    assert '_manifest.md' in zf.namelist()

shutil.rmtree(output_dir.parent, ignore_errors=True)
print('✅ All tests passed')
"
```

## Troubleshooting

### Pandoc not found
```bash
sudo apt-get install pandoc
```

### Tesseract not found
```bash
sudo apt-get install tesseract-ocr
```

### PDF processing fails
```bash
sudo apt-get install poppler-utils
```

### Python import errors
```bash
pip install -r requirements.txt
```

### OCR produces no text
- Image quality may be too low
- Text may be embedded as part of an image (not selectable)
- Language pack may be missing (install `tesseract-ocr-[lang]`)

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Areas for improvement:
- Additional file format support
- Performance optimizations
- Enhanced error reporting
- Docker containerization
- Database integration for processing history
- REST API for batch processing

## Architecture

```
app.py
├── Configuration
│   ├── File type definitions (Tiers S, A, C, F)
│   └── System dependency checker
├── Tier Handlers
│   ├── handle_tier_s() - Copy as-is
│   ├── handle_tier_a() - Convert to Markdown
│   ├── handle_tier_c() - OCR extraction
│   └── handle_tier_f() - Log ignored files
├── Processing Pipeline
│   ├── process_zip() - Main orchestration
│   └── generate_manifest() - Report generation
├── Flask Routes
│   ├── GET / - Web interface
│   ├── GET /check-deps - Dependency check
│   ├── POST /process - Upload endpoint
│   └── GET /download - Download endpoint
└── HTML/JS Frontend
    └── Drag-and-drop interface
```
