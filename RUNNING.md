# Running the LLM Pre-Processing Pipeline

## Environment Limitations

This is a sandboxed cloud environment. Preview windows typically handle Next.js dev servers automatically, but the Flask server requires separate setup.

## Option 1: Two-Terminal Setup (Recommended for Development)

```bash
# Terminal 1: Start Flask backend on port 5000
cd /workspace/2b60aab8-00ef-460b-b7a4-0e23d6c2d3b3/sessions/agent_4778b7d6-542a-4519-b7a4-0e23d6c2d3b3
python app.py &

# Terminal 2: Preview will auto-start Next.js on port 3000
# Access at: http://localhost:3000/pipeline
```

## Option 2: Single Command (Background Processes)

```bash
# Start Flask in background
cd /workspace/2b60aab8-00ef-460b-b7a4-0e23d6c2d3b3/sessions/agent_4778b7d6-542a-4519-b164-ea3ecbffab3b
nohup python app.py > flask.log 2>&1 &

# The sandbox will auto-start Next.js dev server
# Check with: ps aux | grep python
```

## Option 3: Use the Python Script Directly

If Flask isn't accessible via preview, you can test the Python logic directly:

```python
from app import process_zip
from pathlib import Path

# Create test files
import os
os.makedirs("/tmp/test_input", exist_ok=True)
os.makedirs("/tmp/test_output", exist_ok=True)

with open("/tmp/test_input/test.py", "w") as f:
    f.write("print('hello world')")
    
with open("/tmp/test_input/readme.md", "w") as f:
    f.write("# Test Document")

# Create zip
import zipfile
with zipfile.ZipFile("/tmp/test_input/test.zip", "w") as zf:
    zf.write("/tmp/test_input/test.py", "test.py")
    zf.write("/tmp/test_input/readme.md", "readme.md")

# Process
result = process_zip(Path("/tmp/test_input/test.zip"), Path("/tmp/test_output"))
print(f"Output: {result}")
```

## Access Points

- **Next.js UI**: `/pipeline` route (auto-handled by preview)
- **Flask Direct**: `http://localhost:5000` (if running)
- **Health Check**: `http://localhost:5000/health`
- **Dependencies**: `http://localhost:5000/check-deps`

## Environment Notes

- The sandbox handles `next dev` automatically when you open the preview
- Flask server must be started manually
- Both servers can run simultaneously on ports 3000 and 5000
- The Next.js UI connects to Flask at `http://localhost:5000`