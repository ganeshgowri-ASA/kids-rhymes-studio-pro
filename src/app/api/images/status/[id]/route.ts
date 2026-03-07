import { NextRequest, NextResponse } from "next/server";
import { checkPredictionStatus } from "@/lib/image/replicate-client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Prediction ID is required" }, { status: 400 });
    }

    const result = await checkPredictionStatus(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Status check failed" },
      { status: 500 }
    );
  }
}
