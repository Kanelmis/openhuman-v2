import { NextRequest } from 'next/server';
import { jsonResponse, jsonError } from '@/lib/api/helpers';
import { createToken, setSession } from '@/lib/utils/auth';
import { DEMO_USERS } from '@/lib/utils/demo-data';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return jsonError('Email and password are required', 400);
    }

    // In production: verify credentials against Firebase Auth
    // Demo mode: find user by email
    const user = DEMO_USERS.find((u) => u.email === email);
    if (!user) {
      return jsonError('Invalid email or password', 401);
    }

    // Demo mode: accept any password
    // Production: bcrypt.compare(password, user.passwordHash)

    const token = await createToken({ id: user.id, email: user.email, name: user.name });
    await setSession(token);

    return jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch {
    return jsonError('Internal server error', 500);
  }
}
