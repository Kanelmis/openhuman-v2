import { NextRequest } from 'next/server';
import { jsonResponse, jsonError, authenticateRequest, optionsResponse } from '@/lib/api/helpers';
import { DEMO_TASKS } from '@/lib/utils/demo-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  const { id } = await params;
  const task = DEMO_TASKS.find((t) => t.id === id);
  if (!task) return jsonError('Task not found', 404);

  return jsonResponse(task);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  const { id } = await params;
  const task = DEMO_TASKS.find((t) => t.id === id);
  if (!task) return jsonError('Task not found', 404);

  // Only creator or assigned human can update
  if (task.createdBy !== auth.userId && task.assignedTo !== auth.userId) {
    return jsonError('Forbidden', 403);
  }

  try {
    const updates = await req.json();
    const allowedUpdates = ['status', 'assignedTo', 'priority', 'description', 'budget', 'deadline'];
    const filtered: Record<string, unknown> = {};
    for (const key of allowedUpdates) {
      if (key in updates) filtered[key] = updates[key];
    }

    const updated = { ...task, ...filtered, updatedAt: new Date().toISOString() };
    return jsonResponse(updated);
  } catch {
    return jsonError('Invalid request body', 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  const { id } = await params;
  const task = DEMO_TASKS.find((t) => t.id === id);
  if (!task) return jsonError('Task not found', 404);

  if (task.createdBy !== auth.userId) {
    return jsonError('Forbidden', 403);
  }

  if (task.status !== 'open') {
    return jsonError('Cannot delete a task that is not open', 400);
  }

  // In production: deleteTask(id) or soft-delete in Firestore
  return jsonResponse({ message: 'Task deleted', id });
}

export async function OPTIONS() {
  return optionsResponse();
}
