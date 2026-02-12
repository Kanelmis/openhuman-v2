import { NextRequest } from 'next/server';
import {
  jsonResponse,
  jsonPaginated,
  jsonError,
  authenticateRequest,
  getQueryParams,
  optionsResponse,
} from '@/lib/api/helpers';
import { DEMO_TASKS } from '@/lib/utils/demo-data';
import type { Task, TaskCategory } from '@/types';

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  const q = getQueryParams(req);
  const page = q.getNumber('page', 1);
  const limit = q.getNumber('limit', 20);
  const search = q.get('search');
  const category = q.get('category') as TaskCategory | 'all' | '';
  const status = q.get('status');
  const priority = q.get('priority');
  const location = q.get('location');
  const remoteOnly = q.getBoolean('remote');
  const skills = q.getArray('skills');
  const minBudget = q.getNumber('min_budget', 0);
  const maxBudget = q.getNumber('max_budget', 0);
  const sortBy = q.get('sort', 'newest');

  let results: Task[] = [...DEMO_TASKS];

  // Filters
  if (search) {
    const s = search.toLowerCase();
    results = results.filter(
      (t) =>
        t.title.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.tags.some((tag) => tag.toLowerCase().includes(s)),
    );
  }
  if (category && category !== 'all') {
    results = results.filter((t) => t.category === category);
  }
  if (status) {
    results = results.filter((t) => t.status === status);
  }
  if (priority) {
    results = results.filter((t) => t.priority === priority);
  }
  if (location) {
    results = results.filter((t) => t.location?.toLowerCase().includes(location.toLowerCase()));
  }
  if (remoteOnly) {
    results = results.filter((t) => t.isRemote);
  }
  if (skills.length > 0) {
    results = results.filter((t) => skills.some((sk) => t.requiredSkills.includes(sk)));
  }
  if (minBudget > 0) {
    results = results.filter((t) => t.budget >= minBudget);
  }
  if (maxBudget > 0) {
    results = results.filter((t) => t.budget <= maxBudget);
  }

  // Sort
  const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
  switch (sortBy) {
    case 'newest':
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'priority':
      results.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      break;
    case 'highest_pay':
      results.sort((a, b) => b.budget - a.budget);
      break;
    case 'trending':
      results.sort((a, b) => b.applicants.length - a.applicants.length);
      break;
  }

  const total = results.length;
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  return jsonPaginated(paged, page, limit, total);
}

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth) return jsonError('Unauthorized', 401);

  try {
    const body = await req.json();
    const { title, description, category, priority, budget, currency, location, isRemote, requiredSkills, deadline, tags } = body;

    if (!title || !description || !category || !budget) {
      return jsonError('Missing required fields: title, description, category, budget', 400);
    }

    const task: Task = {
      id: `t_${Date.now()}`,
      title,
      description,
      category: category || 'other',
      priority: priority || 'normal',
      status: 'open',
      budget,
      currency: currency || 'USD',
      location: location || undefined,
      isRemote: isRemote || false,
      requiredSkills: requiredSkills || [],
      deadline: deadline || undefined,
      createdBy: auth.userId,
      createdByAgent: auth.isAgent ? auth.userId : undefined,
      assignedTo: undefined,
      applicants: [],
      isPublic: true,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In production: createTask(task) in Firestore
    return jsonResponse(task, 201);
  } catch {
    return jsonError('Invalid request body', 400);
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
