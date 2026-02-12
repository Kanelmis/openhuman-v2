import { NextRequest } from 'next/server';
import { jsonResponse, jsonError } from '@/lib/api/helpers';
import { createToken, setSession } from '@/lib/utils/auth';
import { generateReferralCode } from '@/lib/utils';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, username, referralCode } = await req.json();

    if (!email || !password || !name || !username) {
      return jsonError('All fields are required', 400);
    }

    if (password.length < 8) {
      return jsonError('Password must be at least 8 characters', 400);
    }

    // In production: check if email/username exists in Firestore
    // In production: create user in Firebase Auth + Firestore

    const userId = `u_${Date.now()}`;
    const newUser: Partial<User> = {
      id: userId,
      email,
      name,
      username,
      hourlyRate: 30,
      currency: 'USD',
      isAvailable: true,
      isVerified: false,
      rating: 0,
      totalTasks: 0,
      totalEarned: 0,
      skills: [],
      languages: ['English'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Handle referral code if provided
    if (referralCode) {
      // In production: validate referral code and create referral record
      console.log(`Referral code used: ${referralCode}`);
    }

    const token = await createToken({ id: userId, email, name });
    await setSession(token);

    return jsonResponse({ user: newUser, token }, 201);
  } catch {
    return jsonError('Internal server error', 500);
  }
}
