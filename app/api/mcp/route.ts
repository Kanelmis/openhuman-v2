import { NextRequest } from 'next/server';
import { handleMCPRequest, handleMCPSSE } from '@/lib/mcp/server';

// POST: JSON-RPC MCP requests
export async function POST(req: NextRequest) {
  return handleMCPRequest(req);
}

// GET: SSE transport for streaming connections
export async function GET(req: NextRequest) {
  return handleMCPSSE(req);
}
