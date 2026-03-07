import { NextRequest, NextResponse } from "next/server";
import { getStatus } from "@/lib/music/suno-client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    const result = await getStatus(taskId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
