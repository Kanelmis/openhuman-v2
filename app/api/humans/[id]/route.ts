import { NextRequest } from 'next/server';
import { jsonResponse, jsonError, authenticateRequest, optionsResponse } from '@/lib/api/helpers';
import { DEMO_USERS } from '@/lib/utils/demo-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  const { id } = await params;

  // In production: getUser(id) from Firestore
  const user = DEMO_USERS.find((u) => u.id === id);
  if (!user) return jsonError('Human not found', 404);

  // Don't expose email to agents unless it's the user themselves
  if (auth.isAgent) {
    const { email, ...safeUser } = user;
    return jsonResponse(safeUser);
  }

  return jsonResponse(user);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  const { id } = await params;
  if (auth.userId !== id && !auth.isAgent) {
    return jsonError('Forbidden', 403);
  }

  try {
    const updates = await req.json();
    // In production: updateUser(id, updates) in Firestore
    const user = DEMO_USERS.find((u) => u.id === id);
    if (!user) return jsonError('Human not found', 404);

    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    return jsonResponse(updated);
  } catch {
    return jsonError('Invalid request body', 400);
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
