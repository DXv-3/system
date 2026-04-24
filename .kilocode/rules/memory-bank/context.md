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

## Current Focus

The template and LLM pipeline are production-ready. Next steps depend on user requirements:

1. What type of application to build using the Next.js template
2. What features are needed
3. Design/branding preferences

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

### Quick Start

```bash
# Install system dependencies
sudo apt-get install -y pandoc tesseract-ocr poppler-utils

# Install Python dependencies  
pip install -r requirements.txt

# Run the server
python app.py
```

Then navigate to http://localhost:5000

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

---

*Last updated: 2026-04-24*

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
