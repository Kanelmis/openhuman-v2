/**
 * OpenHuman MCP Server
 * Model Context Protocol server enabling AI agents to interact with the platform.
 * Agents can search humans, create tasks, manage bookings, and process payments.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/utils/auth';
import { TASK_CATEGORIES } from '@/types';

// ─── MCP Protocol Types ────────────────────────────────────────────
interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// ─── Tool Definitions ──────────────────────────────────────────────
const TOOLS: MCPTool[] = [
  {
    name: 'search_humans',
    description:
      'Search for available humans by location, skills, availability, and rating. Returns matched human profiles with their capabilities and rates.',
    inputSchema: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'City or region to search (e.g. "San Francisco", "Tokyo")' },
        skills: {
          type: 'array',
          items: { type: 'string' },
          description: 'Required skills (e.g. ["photography", "mandarin", "driving"])',
        },
        min_rating: { type: 'number', description: 'Minimum rating threshold (1-5)', minimum: 1, maximum: 5 },
        max_rate: { type: 'number', description: 'Maximum hourly rate in USD' },
        available_now: { type: 'boolean', description: 'Only return currently available humans' },
        limit: { type: 'number', description: 'Max results to return (default 10)', default: 10 },
      },
    },
  },
  {
    name: 'get_human_profile',
    description: 'Get detailed profile of a specific human including skills, reviews, availability calendar, and completed task history.',
    inputSchema: {
      type: 'object',
      properties: {
        human_id: { type: 'string', description: 'The unique ID of the human' },
      },
      required: ['human_id'],
    },
  },
  {
    name: 'create_task',
    description:
      'Create a new task that humans can accept. Specify requirements, location, pay, and deadline. The task will appear in the marketplace.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Short task title' },
        description: { type: 'string', description: 'Detailed task description and requirements' },
        category: {
          type: 'string',
          enum: Object.keys(TASK_CATEGORIES),
          description: 'Task category',
        },
        location: { type: 'string', description: 'Task location (city/address) or "remote"' },
        is_remote: { type: 'boolean', description: 'Whether this task can be done remotely' },
        pay_amount: { type: 'number', description: 'Payment amount in USD' },
        pay_type: { type: 'string', enum: ['fixed', 'hourly'], description: 'Payment structure' },
        deadline: { type: 'string', description: 'ISO 8601 deadline for task completion' },
        required_skills: {
          type: 'array',
          items: { type: 'string' },
          description: 'Skills required to complete the task',
        },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
      },
      required: ['title', 'description', 'category', 'location', 'pay_amount'],
    },
  },
  {
    name: 'create_booking',
    description:
      'Book a specific human for a task. Creates a binding agreement and initiates the escrow payment flow.',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: 'The task to book for' },
        human_id: { type: 'string', description: 'The human to book' },
        payment_method: {
          type: 'string',
          enum: ['usdc_ethereum', 'usdc_polygon', 'usdc_base', 'usdt_trc20', 'usdt_erc20', 'eth', 'btc', 'sol', 'wechat_pay', 'alipay'],
          description: 'Payment method to use',
        },
        message: { type: 'string', description: 'Optional message to the human' },
        scheduled_at: { type: 'string', description: 'ISO 8601 datetime for when the task should be performed' },
      },
      required: ['task_id', 'human_id', 'payment_method'],
    },
  },
  {
    name: 'get_booking_status',
    description:
      'Check the current status of a booking including task progress, payment status, and any messages from the human.',
    inputSchema: {
      type: 'object',
      properties: {
        booking_id: { type: 'string', description: 'The booking ID to check' },
      },
      required: ['booking_id'],
    },
  },
  {
    name: 'list_bookings',
    description: 'List all bookings for the authenticated agent, optionally filtered by status.',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
          description: 'Filter by booking status',
        },
        limit: { type: 'number', description: 'Max results (default 20)', default: 20 },
        offset: { type: 'number', description: 'Pagination offset', default: 0 },
      },
    },
  },
  {
    name: 'submit_review',
    description: 'Submit a review for a completed booking. Ratings affect the human\'s profile score.',
    inputSchema: {
      type: 'object',
      properties: {
        booking_id: { type: 'string', description: 'The completed booking to review' },
        rating: { type: 'number', description: 'Rating from 1-5 stars', minimum: 1, maximum: 5 },
        comment: { type: 'string', description: 'Written review text' },
      },
      required: ['booking_id', 'rating'],
    },
  },
  {
    name: 'cancel_booking',
    description:
      'Cancel an active booking. Refund policy depends on cancellation timing and booking status.',
    inputSchema: {
      type: 'object',
      properties: {
        booking_id: { type: 'string', description: 'The booking to cancel' },
        reason: { type: 'string', description: 'Reason for cancellation' },
      },
      required: ['booking_id'],
    },
  },
  {
    name: 'get_platform_stats',
    description: 'Get current platform statistics including available humans, active tasks, and response times by region.',
    inputSchema: {
      type: 'object',
      properties: {
        region: { type: 'string', description: 'Filter stats by region (optional)' },
      },
    },
  },
];

// ─── Tool Handlers ─────────────────────────────────────────────────
async function handleTool(name: string, args: Record<string, unknown>, agentId: string): Promise<unknown> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Agent-Id': agentId,
    'X-MCP-Request': 'true',
  };

  switch (name) {
    case 'search_humans': {
      const params = new URLSearchParams();
      if (args.location) params.set('location', String(args.location));
      if (args.skills) params.set('skills', (args.skills as string[]).join(','));
      if (args.min_rating) params.set('min_rating', String(args.min_rating));
      if (args.max_rate) params.set('max_rate', String(args.max_rate));
      if (args.available_now) params.set('available_now', 'true');
      if (args.limit) params.set('limit', String(args.limit));
      const res = await fetch(`${baseUrl}/api/humans?${params}`, { headers });
      return res.json();
    }

    case 'get_human_profile': {
      const res = await fetch(`${baseUrl}/api/humans/${args.human_id}`, { headers });
      return res.json();
    }

    case 'create_task': {
      const res = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(args),
      });
      return res.json();
    }

    case 'create_booking': {
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(args),
      });
      return res.json();
    }

    case 'get_booking_status': {
      const res = await fetch(`${baseUrl}/api/bookings/${args.booking_id}`, { headers });
      return res.json();
    }

    case 'list_bookings': {
      const params = new URLSearchParams();
      if (args.status) params.set('status', String(args.status));
      if (args.limit) params.set('limit', String(args.limit));
      if (args.offset) params.set('offset', String(args.offset));
      const res = await fetch(`${baseUrl}/api/bookings?${params}`, { headers });
      return res.json();
    }

    case 'submit_review': {
      const res = await fetch(`${baseUrl}/api/bookings/${args.booking_id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ action: 'review', rating: args.rating, comment: args.comment }),
      });
      return res.json();
    }

    case 'cancel_booking': {
      const res = await fetch(`${baseUrl}/api/bookings/${args.booking_id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ action: 'cancel', reason: args.reason }),
      });
      return res.json();
    }

    case 'get_platform_stats': {
      const params = new URLSearchParams();
      if (args.region) params.set('region', String(args.region));
      const res = await fetch(`${baseUrl}/api/stats?${params}`, { headers });
      return res.json();
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ─── MCP Request Handler ───────────────────────────────────────────
function makeResponse(id: string | number, result: unknown): MCPResponse {
  return { jsonrpc: '2.0', id, result };
}

function makeError(id: string | number, code: number, message: string): MCPResponse {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

export async function handleMCPRequest(req: NextRequest): Promise<NextResponse> {
  // Authenticate
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(makeError(0, -32000, 'Missing or invalid Authorization header'), { status: 401 });
  }

  const apiKey = authHeader.slice(7);
  const agent = await verifyApiKey(apiKey);
  if (!agent) {
    return NextResponse.json(makeError(0, -32000, 'Invalid API key'), { status: 401 });
  }

  const agentId = typeof agent === 'string' ? agent : (agent as { id: string }).id || 'unknown';

  // Parse request
  let body: MCPRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(makeError(0, -32700, 'Parse error'), { status: 400 });
  }

  if (body.jsonrpc !== '2.0' || !body.method || !body.id) {
    return NextResponse.json(makeError(body?.id || 0, -32600, 'Invalid Request'), { status: 400 });
  }

  // Route methods
  switch (body.method) {
    case 'initialize':
      return NextResponse.json(
        makeResponse(body.id, {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'openhuman',
            version: '1.0.0',
          },
          capabilities: {
            tools: { listChanged: false },
          },
        })
      );

    case 'tools/list':
      return NextResponse.json(makeResponse(body.id, { tools: TOOLS }));

    case 'tools/call': {
      const params = body.params as { name: string; arguments?: Record<string, unknown> } | undefined;
      if (!params?.name) {
        return NextResponse.json(makeError(body.id, -32602, 'Missing tool name'));
      }

      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) {
        return NextResponse.json(makeError(body.id, -32601, `Unknown tool: ${params.name}`));
      }

      try {
        const result = await handleTool(params.name, params.arguments || {}, agentId);
        return NextResponse.json(
          makeResponse(body.id, {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          })
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Tool execution failed';
        return NextResponse.json(makeError(body.id, -32603, message));
      }
    }

    default:
      return NextResponse.json(makeError(body.id, -32601, `Method not found: ${body.method}`));
  }
}

// ─── SSE Transport for Streaming ───────────────────────────────────
export async function handleMCPSSE(req: NextRequest): Promise<Response> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const apiKey = authHeader.slice(7);
  const agent = await verifyApiKey(apiKey);
  if (!agent) {
    return new Response('Invalid API key', { status: 401 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send endpoint info
      controller.enqueue(encoder.encode(`event: endpoint\ndata: /api/mcp\n\n`));

      // Keep-alive ping every 30s
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 30000);

      // Clean up on abort
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
