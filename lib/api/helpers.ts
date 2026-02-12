import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, verifyApiKey } from '@/lib/utils/auth';
import type { ApiResponse } from '@/types';

// Standard JSON response helpers
export function jsonResponse<T>(data: T, status = 200): NextResponse {
  const body: ApiResponse<T> = { success: true, data };
  return NextResponse.json(body, { status });
}

export function jsonError(error: string, status = 400): NextResponse {
  const body: ApiResponse = { success: false, error };
  return NextResponse.json(body, { status });
}

export function jsonPaginated<T>(
  data: T,
  page: number,
  limit: number,
  total: number,
): NextResponse {
  const body: ApiResponse<T> = {
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
  return NextResponse.json(body);
}

// Auth middleware - supports both JWT session and API key
export async function authenticateRequest(
  req: NextRequest,
): Promise<{ userId: string; isAgent: boolean } | null> {
  // Check API key first (for agent endpoints)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer oh_')) {
    const apiKey = authHeader.slice(7);
    const result = await verifyApiKey(apiKey);
    if (result) return { userId: result.userId, isAgent: true };
  }

  // Check JWT session
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const payload = await verifyToken(token);
    if (payload) return { userId: payload.sub, isAgent: false };
  }

  // Check cookie session
  const sessionCookie = req.cookies.get('oh-session')?.value;
  if (sessionCookie) {
    const payload = await verifyToken(sessionCookie);
    if (payload) return { userId: payload.sub, isAgent: false };
  }

  return null;
}

// Parse query params with defaults
export function getQueryParams(req: NextRequest) {
  const url = new URL(req.url);
  return {
    get: (key: string, defaultVal = '') => url.searchParams.get(key) || defaultVal,
    getNumber: (key: string, defaultVal = 0) => {
      const val = url.searchParams.get(key);
      return val ? parseInt(val, 10) : defaultVal;
    },
    getBoolean: (key: string) => url.searchParams.get(key) === 'true',
    getArray: (key: string) => {
      const val = url.searchParams.get(key);
      return val ? val.split(',').map((s) => s.trim()) : [];
    },
  };
}

// CORS headers for API routes
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export function optionsResponse() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
