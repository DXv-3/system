export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold mb-4">LLM Pre-Processing Pipeline</h1>
        <p className="text-neutral-400 mb-6">
          Convert ZIP archives into LLM-optimized packages with intelligent file processing.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
          <div className="bg-neutral-800 p-3 rounded">
            <div className="text-blue-400 font-bold">Tier S</div>
            <div className="text-neutral-500">Code/Text → Passthrough</div>
          </div>
          <div className="bg-neutral-800 p-3 rounded">
            <div className="text-cyan-400 font-bold">Tier A</div>
            <div className="text-neutral-500">Docs → Markdown</div>
          </div>
          <div className="bg-neutral-800 p-3 rounded">
            <div className="text-amber-400 font-bold">Tier C</div>
            <div className="text-neutral-500">Images → OCR Text</div>
          </div>
          <div className="bg-neutral-800 p-3 rounded">
            <div className="text-neutral-500 font-bold">Tier F</div>
            <div className="text-neutral-500">Binary → Ignored</div>
          </div>
        </div>
        <a href="/pipeline" className="inline-block px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </a>
      </div>
    </main>
  );
}
