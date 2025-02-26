import { NextRequest } from 'next/server';
import { updateSession } from './src/lib/authActions';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
