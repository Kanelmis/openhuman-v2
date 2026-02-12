import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/utils/auth';
import { DEMO_USERS } from '@/lib/utils/demo-data';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // In production: fetch from Firestore
    // const user = await getUser(session.sub);
    const user = DEMO_USERS.find((u) => u.id === session.sub) || DEMO_USERS[0];

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
        avatar: user.avatarUrl,
        verified: user.isVerified,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
