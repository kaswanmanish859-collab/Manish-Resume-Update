import { NextRequest, NextResponse } from 'next/server';
import { validateGeminiApiKey } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, valid: false, error: 'Invalid or empty JSON request body.' },
        { status: 400 }
      );
    }

    const { apiKey } = body || {};
    const result = await validateGeminiApiKey(apiKey);
    return NextResponse.json({
      success: result.valid,
      ...result,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, valid: false, error: error.message || 'Key validation error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: 'validate-key',
  });
}
