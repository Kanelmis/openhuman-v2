import { jsonResponse } from '@/lib/api/helpers';
import { clearSession } from '@/lib/utils/auth';

export async function POST() {
  await clearSession();
  return jsonResponse({ message: 'Logged out successfully' });
}
