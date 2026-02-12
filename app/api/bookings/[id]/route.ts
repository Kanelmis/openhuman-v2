import { NextRequest } from 'next/server';
import { jsonResponse, jsonError, authenticateRequest, optionsResponse } from '@/lib/api/helpers';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  const { id } = await params;

  // In production: getBooking(id) from Firestore
  // Demo response
  return jsonResponse({
    id,
    taskId: 't4',
    humanId: 'u3',
    agentId: 'agent-claude',
    status: 'confirmed',
    startTime: '2025-02-06T09:00:00Z',
    totalAmount: 80,
    currency: 'USD',
    paymentMethod: 'usdc_polygon',
    paymentStatus: 'completed',
    createdAt: '2025-02-05T20:00:00Z',
    updatedAt: '2025-02-06T09:00:00Z',
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  const { id } = await params;

  try {
    const { status, notes } = await req.json();

    const allowedTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['active', 'cancelled'],
      active: ['completed', 'cancelled'],
    };

    // In production: validate status transition and update Firestore
    return jsonResponse({
      id,
      status: status || 'confirmed',
      notes,
      updatedAt: new Date().toISOString(),
      message: 'Booking updated',
    });
  } catch {
    return jsonError('Invalid request body', 400);
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
