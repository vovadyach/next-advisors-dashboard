import { NextResponse } from 'next/server';

type Handler = () => Promise<Response>;

export async function withErrorHandling(handler: Handler) {
  try {
    return await handler();
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
