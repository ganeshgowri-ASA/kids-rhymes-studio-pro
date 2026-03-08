import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// No-op middleware - language switching is handled client-side via Zustand store
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
