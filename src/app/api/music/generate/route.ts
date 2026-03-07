import { NextRequest, NextResponse } from 'next/server';
import { generateMusic } from '@/lib/music/suno-client';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await generateMusic(body);
  return NextResponse.json(result);
}
