import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/image/replicate-client';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await generateImage(body);
  return NextResponse.json(result);
}
