import CustomError from '@/classes/CustomError';
import { getUserByUsername } from '@/models/userModel';
import bcrypt from 'bcryptjs';
import { TokenContent } from 'hybrid-types';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function login(formData: FormData) {
  // Verify credentials && get the user

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = await getUserByUsername(username);

  if (!user) {
    throw new CustomError('Incorrect username/password', 403);
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new CustomError('Incorrect username/password', 403);
  }

  if (!process.env.JWT_SECRET) {
    throw new CustomError('JWT secret not set', 500);
  }

  const tokenContent: TokenContent = {
    user_id: user.user_id,
    level_name: user.level_name,
  };

  // Create the session
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = jwt.sign(tokenContent, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // Save the session in a cookie'
  const cookieStore = await cookies();
  cookieStore.set('session', session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0) });
}

export async function getSession(): Promise<TokenContent | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session || !process.env.JWT_SECRET) return null;
  return jwt.verify(session, process.env.JWT_SECRET) as TokenContent;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session || !process.env.JWT_SECRET) return;

  // Refresh the session so it doesn't expire
  const parsed = jwt.verify(session, process.env.JWT_SECRET);

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: jwt.sign(parsed, process.env.JWT_SECRET, {
      expiresIn: '7d',
    }),
    httpOnly: true,
    expires,
  });
  return res;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user_id) {
    redirect('/');
  }
}
