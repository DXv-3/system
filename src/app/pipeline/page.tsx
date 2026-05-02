"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ProcessingResult {
  success: boolean;
  filename?: string;
  download_url?: string;
  error?: string;
}

export default function PipelinePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".zip")) {
      setResult({ success: false, error: "Please upload a ZIP file" });
      return;
    }
    setFile(selectedFile);
    setResult(null);
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success && data.download_url) {
        const link = document.createElement("a");
        link.href = `http://localhost:5000${data.download_url}`;
        link.download = data.filename || "processed.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      setResult({ 
        success: false, 
        error: "Processing failed. Use the Web Pipeline at /pipeline/web for browser-only processing, or start the Flask server for full features." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            LLM Pre-Processing Pipeline
          </h1>
          <p className="text-neutral-400 text-lg">
            Convert ZIP archives into LLM-optimized packages with intelligent file processing
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            file ? "border-blue-500 bg-blue-500/10" : "border-neutral-700 hover:border-neutral-600"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept=".zip"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>

            <div>
              <p className="text-xl font-semibold mb-2">
                {file ? file.name : "Drop your ZIP file here"}
              </p>
              <p className="text-neutral-500 text-sm">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse"}
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Select ZIP File
            </button>
          </div>
        </div>

        {file && (
          <div className="mt-8 text-center">
            <button
              onClick={processFile}
              disabled={isProcessing}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Process ZIP File
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <div
            className={`mt-8 p-6 rounded-xl border ${
              result.success ? "bg-green-900/20 border-green-700" : "bg-red-900/20 border-red-700"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-400 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold text-lg ${result.success ? "text-green-300" : "text-red-300"}`}>
                  {result.success ? "Processing Complete!" : "Error"}
                </p>
                {result.error && <p className="text-neutral-300 mt-1">{result.error}</p>}
                {result.success && result.filename && (
                  <p className="text-neutral-400 text-sm mt-2">
                    Output: {result.filename}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-800 rounded-xl p-6">
            <h3 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Tier S - Passthrough
            </h3>
            <p className="text-sm text-neutral-400">Raw text/code/JSON/YAML → Copied as-is</p>
          </div>
          <div className="bg-neutral-800 rounded-xl p-6">
            <h3 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              Tier A - To Markdown
            </h3>
            <p className="text-sm text-neutral-400">DOCX, PPTX, XLSX → Converted to Markdown</p>
          </div>
          <div className="bg-neutral-800 rounded-xl p-6">
            <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Tier C - OCR Extraction
            </h3>
            <p className="text-sm text-neutral-400">Images, PDFs → Text extracted via OCR</p>
          </div>
          <div className="bg-neutral-800 rounded-xl p-6">
            <h3 className="font-semibold text-neutral-500 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-neutral-500 rounded-full"></span>
              Tier F - Ignored
            </h3>
            <p className="text-sm text-neutral-400">Executables, media → Excluded from output</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <p>Requires Flask server running on port 5000</p>
          <p className="mt-1">
            <a href="/pipeline/web" className="text-blue-400 hover:text-blue-300 underline">
              Use Web Pipeline (no server required)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}