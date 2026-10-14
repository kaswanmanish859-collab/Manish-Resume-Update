import { NextRequest, NextResponse } from 'next/server';
import { tailorResumeWithGemini } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid or empty JSON request body.' },
        { status: 400 }
      );
    }

    const { cvText, jobDescription, apiKey, linkedInProfile } = body || {};

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job Description is required. Please paste or enter the target job description.' },
        { status: 400 }
      );
    }

    if (!cvText || typeof cvText !== 'string' || cvText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume content is missing. Please upload a CV or select a sample resume.' },
        { status: 400 }
      );
    }

    if (jobDescription.trim().length < 30) {
      return NextResponse.json(
        {
          success: false,
          error: 'The job description is too brief. Please enter a more detailed job description for accurate ATS tailoring.',
        },
        { status: 400 }
      );
    }

    const tailorResult = await tailorResumeWithGemini(
      cvText.trim(),
      jobDescription.trim(),
      apiKey,
      linkedInProfile
    );

    return NextResponse.json({
      success: true,
      data: tailorResult,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Tailor resume API error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to tailor resume: ${error.message || 'Unknown server error'}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: 'tailor-resume',
  });
}
