import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".zip")) {
      return NextResponse.json({ error: "File must be a ZIP" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return NextResponse.json({
      success: true,
      filename: `llm_optimized_${file.name.replace(".zip", "")}_${Date.now()}.zip`,
      size: buffer.length,
      message: "File received. Use the Web Pipeline for browser-based processing or the Flask server for full features.",
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "LLM Pipeline API ready" });
}