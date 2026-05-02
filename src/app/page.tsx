export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">LLM Pre-Processing Pipeline</h1>
        <p className="text-neutral-400 mb-8">Convert ZIP archives into LLM-optimized packages</p>
        <a href="/pipeline" className="inline-block px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </a>
      </div>
    </main>
  );
}
