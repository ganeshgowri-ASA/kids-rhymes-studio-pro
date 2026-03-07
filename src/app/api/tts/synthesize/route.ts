import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ status: 'browser_tts', message: 'Use browser TTS - no server-side TTS key configured' });
}
