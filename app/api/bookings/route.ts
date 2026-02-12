import { NextRequest } from 'next/server';
import {
  jsonResponse,
  jsonPaginated,
  jsonError,
  authenticateRequest,
  getQueryParams,
  optionsResponse,
} from '@/lib/api/helpers';
import type { Booking } from '@/types';

// In-memory demo bookings
const demoBookings: Booking[] = [
  {
    id: 'b1',
    taskId: 't4',
    humanId: 'u3',
    agentId: 'agent-claude',
    status: 'confirmed',
    startTime: '2025-02-06T09:00:00Z',
    totalAmount: 80,
    currency: 'USD',
    paymentMethod: 'usdc_polygon',
    paymentStatus: 'completed',
    transactionId: 'p1',
    createdAt: '2025-02-05T20:00:00Z',
    updatedAt: '2025-02-06T09:00:00Z',
  },
  {
    id: 'b2',
    taskId: 't8',
    humanId: 'u2',
    agentId: 'agent-claude',
    status: 'completed',
    startTime: '2025-01-22T10:00:00Z',
    endTime: '2025-01-25T15:00:00Z',
    totalAmount: 110,
    currency: 'USD',
    paymentMethod: 'usdt_trc20',
    paymentStatus: 'completed',
    transactionId: 'p2',
    createdAt: '2025-01-21T10:00:00Z',
    updatedAt: '2025-01-25T15:00:00Z',
  },
];

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  const q = getQueryParams(req);
  const page = q.getNumber('page', 1);
  const limit = q.getNumber('limit', 20);
  const status = q.get('status');
  const taskId = q.get('task_id');

  let results = [...demoBookings];

  // Agents see their bookings, humans see theirs
  if (auth.isAgent) {
    results = results.filter((b) => b.agentId === auth.userId);
  } else {
    results = results.filter((b) => b.humanId === auth.userId);
  }

  if (status) results = results.filter((b) => b.status === status);
  if (taskId) results = results.filter((b) => b.taskId === taskId);

  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = results.length;
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  return jsonPaginated(paged, page, limit, total);
}

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  try {
    const { taskId, humanId, paymentMethod, notes } = await req.json();

    if (!taskId || !humanId || !paymentMethod) {
      return jsonError('Missing required fields: taskId, humanId, paymentMethod', 400);
    }

    const booking: Booking = {
      id: `b_${Date.now()}`,
      taskId,
      humanId,
      agentId: auth.isAgent ? auth.userId : undefined,
      status: 'pending',
      startTime: new Date().toISOString(),
      totalAmount: 0, // Calculated from task budget in production
      currency: 'USD',
      paymentMethod,
      paymentStatus: 'pending',
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In production:
    // 1. Verify task is open and human is available
    // 2. Calculate total from task budget
    // 3. Create booking in Firestore
    // 4. Update task status to 'assigned'
    // 5. Send notifications to human

    return jsonResponse(booking, 201);
  } catch {
    return jsonError('Invalid request body', 400);
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
