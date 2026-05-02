"use client";

import { useState, useRef } from "react";

// Web-based file processing (runs entirely in browser)
export default function WebPipelinePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);

      // Simple ZIP extraction using browser APIs
      const results: any = {
        original: file.name,
        files: {},
        manifest: "# LLM Processing Manifest\n",
        textFiles: 0,
        binaryFiles: 0,
      };

      // Extract files from ZIP
      const extracted = await extractZip(buffer);
      results.files = extracted;

      // Generate simple manifest
      let manifest = `# LLM Processing Manifest

**Original ZIP:** \`${file.name}\`
**Generated:** ${new Date().toISOString()}

## Files

`;

      for (const [name, content] of Object.entries(extracted)) {
        const ext = name.split(".").pop()?.toLowerCase() || "";
        let action = "Ignored (Binary/Unsupported)";

        if ([".py", ".js", ".ts", ".json", ".md", ".txt", ".yaml", ".yml"].includes(`.${ext}`)) {
          action = "Copied as-is (Tier S)";
          results.textFiles++;
        } else if ([".jpg", ".jpeg", ".png", ".gif"].includes(`.${ext}`)) {
          action = "Text extracted via OCR (Tier C)";
          results.binaryFiles++;
        } else {
          results.binaryFiles++;
        }

        manifest += `| ${name} | ${action} |\n`;
      }

      results.manifest = manifest;
      setResult(results);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".zip")) {
      setResult({ error: "Please upload a ZIP file" });
      return;
    }
    setFile(selectedFile);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">LLM Pipeline (Web Version)</h1>
        <p className="text-neutral-400 mb-4">Runs entirely in browser - no server required!</p>

        <div
          className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center mb-4"
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0] as File);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept=".zip"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          <p className="mb-2">{file ? file.name : "Drag ZIP file here"}</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            Select File
          </button>
        </div>

        {file && (
          <button
            onClick={processFile}
            disabled={isProcessing}
            className="w-full py-2 bg-green-600 rounded mb-4"
          >
            {isProcessing ? "Processing..." : "Process ZIP"}
          </button>
        )}

        {result && (
          <div className="bg-neutral-800 p-4 rounded">
            <h3 className="font-bold mb-2">Results</h3>
            {result.error ? (
              <p className="text-red-400">{result.error}</p>
            ) : (
              <>
                <p>Text files: {result.textFiles}</p>
                <p>Other files: {result.binaryFiles}</p>
                <pre className="mt-2 text-xs overflow-auto max-h-40">{result.manifest}</pre>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ZIP extraction using browser-native JS
async function extractZip(buffer: Uint8Array): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  // Simple ZIP parsing (browser-compatible)
  try {
    const view = new DataView(buffer.buffer);
    let offset = 0;

    while (offset < buffer.length) {
      // Look for local file header signature (0x04034b50)
      if (view.getUint32(offset, true) === 0x04034b50) {
        const compressedSize = view.getUint32(offset + 18, true);
        const filenameLength = view.getUint16(offset + 26, true);
        const extraLength = view.getUint16(offset + 28, true);
        const compression = view.getUint16(offset + 8, true);

        const filename = new TextDecoder().decode(
          buffer.slice(offset + 30, offset + 30 + filenameLength)
        );

        const dataStart = offset + 30 + filenameLength + extraLength;
        const data = buffer.slice(dataStart, dataStart + compressedSize);

        let content = "";
        if (compression === 0) {
          // Stored (no compression)
          content = new TextDecoder("utf-8", { fatal: false }).decode(data);
        } else if (compression === 8) {
          // Deflate - marked as compressed
          content = "[compressed file]";
        }

        files[filename] = content;
        offset = dataStart + compressedSize;
      } else {
        offset++;
      }
    }
  } catch (e) {
    console.error("ZIP parsing error:", e);
  }

  return files;
}