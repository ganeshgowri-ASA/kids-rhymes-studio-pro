import { NextRequest, NextResponse } from 'next/server';
import { generateLyrics } from '@/lib/ai/provider';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await generateLyrics(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate lyrics' }, { status: 500 });
  }
}
