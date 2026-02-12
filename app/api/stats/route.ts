import { jsonResponse, corsHeaders, optionsResponse } from '@/lib/api/helpers';
import { DEMO_STATS } from '@/lib/utils/demo-data';

export async function GET() {
  // In production: const stats = await getStats() from Firestore
  return jsonResponse(DEMO_STATS);
}

export async function OPTIONS() {
  return optionsResponse();
}
