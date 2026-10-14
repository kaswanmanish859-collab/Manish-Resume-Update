import { NextRequest, NextResponse } from 'next/server';
import 'pdf-parse/worker';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import zlib from 'zlib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Pure JavaScript fallback text extractor for PDF documents.
 * Extracts both uncompressed text streams (BT...ET) and FlateDecode compressed streams
 * with zero native dependencies. Works 100% reliably in serverless/Vercel environments.
 */
function extractTextFromPdfFallback(buffer: Buffer): string {
  try {
    const binary = buffer.toString('binary');
    let fullText = '';

    // 1. Check for uncompressed text streams: BT ... ET
    const btMatches = binary.match(/BT[\s\S]*?ET/g) || [];
    for (const block of btMatches) {
      const tjMatches = block.matchAll(/\((.*?)\)\s*Tj/g);
      for (const m of tjMatches) {
        fullText += m[1] + ' ';
      }
      const tjArrayMatches = block.matchAll(/\[(.*?)\]\s*TJ/g);
      for (const m of tjArrayMatches) {
        const parts = m[1].matchAll(/\((.*?)\)/g);
        for (const p of parts) {
          fullText += p[1] + ' ';
        }
      }
      fullText += '\n';
    }

    // 2. Check for FlateDecode compressed streams if needed
    if (fullText.trim().length < 50) {
      const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
      let match;
      while ((match = streamRegex.exec(binary)) !== null) {
        try {
          const rawStream = Buffer.from(match[1], 'binary');
          const decompressed = zlib.inflateSync(rawStream).toString('utf-8');
          const innerBlocks = decompressed.match(/BT[\s\S]*?ET/g) || [];
          for (const block of innerBlocks) {
            const tjMatches = block.matchAll(/\((.*?)\)\s*Tj/g);
            for (const m of tjMatches) {
              fullText += m[1] + ' ';
            }
            const tjArrayMatches = block.matchAll(/\[(.*?)\]\s*TJ/g);
            for (const m of tjArrayMatches) {
              const parts = m[1].matchAll(/\((.*?)\)/g);
              for (const p of parts) {
                fullText += p[1] + ' ';
              }
            }
            fullText += '\n';
          }
        } catch {
          // Stream is not zlib compressed or is image/binary stream, safely continue
        }
      }
    }

    // Clean escaped characters and whitespace
    return fullText
      .replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
      .replace(/\\([()\\])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (err) {
    console.warn('PDF fallback extraction error:', err);
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const directText = formData.get('text') as string | null;

    if (directText && directText.trim().length > 0) {
      return NextResponse.json({
        success: true,
        text: directText.trim(),
        fileName: 'Direct Input',
        fileType: 'text/plain',
        charCount: directText.length,
      });
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file was uploaded. Please select a PDF, DOCX, or text file.' },
        { status: 400 }
      );
    }

    const fileName = file.name || 'uploaded-file';
    const fileType = file.type || '';
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum limit of 10MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = '';

    if (extension === 'pdf' || fileType.includes('pdf')) {
      // Tier 1: Try modern PDFParse with serverless worker
      try {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        extractedText = (result.text || '').trim();
      } catch (pdfErr) {
        console.warn('Primary PDFParse attempt failed, switching to native stream extractor:', pdfErr);
      }

      // Tier 2: Pure JavaScript stream extractor fallback (immune to serverless bundle/worker errors)
      if (!extractedText || extractedText.length < 20) {
        const fallbackText = extractTextFromPdfFallback(buffer);
        if (fallbackText && fallbackText.length >= 20) {
          extractedText = fallbackText;
        }
      }

      if (!extractedText || extractedText.length < 20) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Unable to extract readable text from this PDF. It may be a scanned image-only PDF without OCR, or password-protected. Please copy/paste the text directly or upload DOCX/TXT.',
          },
          { status: 422 }
        );
      }
    } else if (
      extension === 'docx' ||
      fileType.includes('wordprocessingml') ||
      fileType.includes('msword')
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = (result.value || '').trim();
      } catch (docxErr: unknown) {
        const err = docxErr as Error;
        console.error('DOCX parsing error:', err);
        return NextResponse.json(
          {
            success: false,
            error: `Failed to extract text from DOCX document (${err.message || 'Invalid format'}).`,
          },
          { status: 422 }
        );
      }
    } else if (
      extension === 'txt' ||
      extension === 'md' ||
      fileType.startsWith('text/')
    ) {
      extractedText = buffer.toString('utf-8').trim();
    } else {
      try {
        extractedText = buffer.toString('utf-8').trim();
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported file format (.${extension || 'unknown'}). Please upload a PDF, DOCX, or TXT file.`,
          },
          { status: 400 }
        );
      }
    }

    const cleanedText = extractedText.trim();
    if (!cleanedText || cleanedText.length < 20) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Extracted content is too short or empty. Please ensure the document contains readable text.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text: cleanedText,
      fileName,
      fileType: extension || fileType,
      charCount: cleanedText.length,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Unexpected parse error:', error);
    return NextResponse.json(
      {
        success: false,
        error: `Could not process document (${error.message || 'File parsing error'}). You can paste your resume text directly into the field below.`,
      },
      { status: 422 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: 'parse-cv',
  });
}
