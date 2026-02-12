import { NextRequest } from 'next/server';
import {
  jsonResponse,
  jsonPaginated,
  jsonError,
  authenticateRequest,
  getQueryParams,
  optionsResponse,
} from '@/lib/api/helpers';
import { DEMO_USERS } from '@/lib/utils/demo-data';
import type { User } from '@/types';

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  const q = getQueryParams(req);
  const page = q.getNumber('page', 1);
  const limit = q.getNumber('limit', 20);
  const search = q.get('search');
  const skills = q.getArray('skills');
  const location = q.get('location');
  const availableOnly = q.getBoolean('available');
  const verifiedOnly = q.getBoolean('verified');
  const minRating = q.getNumber('min_rating', 0);
  const sortBy = q.get('sort', 'rating');

  // In production: Firestore query with filters
  let results: User[] = [...DEMO_USERS];

  // Filter
  if (search) {
    const s = search.toLowerCase();
    results = results.filter(
      (u) =>
        u.name.toLowerCase().includes(s) ||
        u.bio?.toLowerCase().includes(s) ||
        u.skills.some((sk) => sk.toLowerCase().includes(s)),
    );
  }
  if (skills.length > 0) {
    results = results.filter((u) => skills.some((sk) => u.skills.includes(sk)));
  }
  if (location) {
    results = results.filter((u) => u.location?.toLowerCase().includes(location.toLowerCase()));
  }
  if (availableOnly) {
    results = results.filter((u) => u.isAvailable);
  }
  if (verifiedOnly) {
    results = results.filter((u) => u.isVerified);
  }
  if (minRating > 0) {
    results = results.filter((u) => u.rating >= minRating);
  }

  // Sort
  switch (sortBy) {
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'tasks':
      results.sort((a, b) => b.totalTasks - a.totalTasks);
      break;
    case 'rate_low':
      results.sort((a, b) => a.hourlyRate - b.hourlyRate);
      break;
    case 'rate_high':
      results.sort((a, b) => b.hourlyRate - a.hourlyRate);
      break;
    case 'newest':
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  const total = results.length;
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  return jsonPaginated(paged, page, limit, total);
}

export async function OPTIONS() {
  return optionsResponse();
}
