# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ Ready for development

The template is a clean Next.js 16 starter with TypeScript and Tailwind CSS 4. It's ready for AI-assisted expansion to build any type of application.

Additionally, a standalone **LLM Pre-Processing Pipeline** application has been generated (`app.py`) that converts ZIP files into LLM-optimized packages.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] LLM Pre-Processing Pipeline (`app.py`) - ZIP to LLM-optimized converter
  - [x] System dependency validation (pandoc, tesseract, poppler)
  - [x] Input validation and error handling
  - [x] Integration testing
  - [x] Comprehensive documentation
  - [x] Full deployment with all dependencies installed
  - [x] Flask server running on port 5000
  - [x] Next.js UI created at `/pipeline` route
  - [x] lucide-react icons installed
- [x] Fixed unused imports in `/api/process/route.ts`
- [x] Removed duplicate `/pipeline/web-pipeline.tsx` file
- [x] Added homepage content with call-to-action
- [x] Promoted Web Pipeline as primary option on `/pipeline` page

## LLM Pipeline Overview

**`app.py`** is a production-ready Flask web application (1144 lines) that:

- ✅ Drag-and-drop ZIP file upload interface
- ✅ Validates system dependencies (pandoc, tesseract, poppler)
- ✅ Validates file size (500MB limit)
- ✅ Applies LLM Data-Type Hierarchy to each file:
  - **Tier S**: Code/text/JSON/YAML/Markdown → passthrough
  - **Tier A**: DOCX/PPTX/XLSX/RTF/ODT → Markdown via pandoc
  - **Tier C**: PNG/JPG/GIF/BMP/PDF → OCR text extraction
  - **Tier F**: Binary/executable/media → excluded
- ✅ Generates `_manifest.md` with complete file tree and processing log
- ✅ Returns downloadable ZIP optimized for LLM ingestion
- ✅ Comprehensive error handling and logging
- ✅ Automatic cleanup of temp directories

## Next.js UI (`/pipeline`)

A modern frontend has been added with:
- Drag-and-drop ZIP file upload
- File size display
- Processing state management
- Success/error result display
- Tier information cards
- Connects to Flask backend at `http://localhost:5000`

### Web Pipeline (`/pipeline/web`)

Browser-only version that runs entirely in the browser:
- No server required
- Basic ZIP extraction and manifest generation
- Shows file tier categorization

### To use the Next.js UI:

```bash
# Terminal 1: Start Flask server
python app.py

# Terminal 2: Start Next.js dev server
bun run dev
```

Then open: http://localhost:3000/pipeline

## Current Focus

The template and LLM pipeline are production-ready. Next steps depend on user requirements:

1. What type of application to build using the Next.js template
2. What features are needed
3. Design/branding preferences

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

---

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To use the LLM Pipeline:

1. Start Flask server: `python app.py`
2. Open Next.js UI: http://localhost:3000/pipeline
3. Drag and drop a ZIP file
4. Click "Process ZIP File"
5. Download the LLM-optimized result

---

*Last updated: 2026-05-02*