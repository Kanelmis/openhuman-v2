import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { User } from '@/types';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'openhuman-dev-secret-change-in-production');

export async function createToken(user: Pick<User, 'id' | 'email' | 'name'>): Promise<string> {
  return new SignJWT({ sub: user.id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { sub: string; email: string; name: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('oh-session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('oh-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('oh-session');
}

// API Key auth for agent endpoints
export async function verifyApiKey(key: string): Promise<{ userId: string } | null> {
  // In production, look up in Firestore
  if (key.startsWith('oh_')) {
    return { userId: 'agent-' + key.slice(3, 11) };
  }
  return null;
}
