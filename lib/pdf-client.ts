/**
 * Client-side fast PDF text extraction helper.
 * Extracts text from PDF files directly in the browser with 0ms network latency.
 */
export async function extractPdfTextInBrowser(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Convert bytes to binary string safely without stack overflow
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const slice = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      binary += String.fromCharCode.apply(null, Array.from(slice));
    }

    let fullText = '';

    // Search for uncompressed text blocks: BT ... ET
    const btMatches = binary.match(/BT[\s\S]*?ET/g) || [];
    for (const block of btMatches) {
      // 1. Tj operator: (string) Tj
      const tjMatches = block.matchAll(/\((.*?)\)\s*Tj/g);
      for (const m of tjMatches) {
        fullText += m[1] + ' ';
      }

      // 2. TJ operator: [(string) 120 (string)] TJ
      const tjArrayMatches = block.matchAll(/\[(.*?)\]\s*TJ/g);
      for (const m of tjArrayMatches) {
        const parts = m[1].matchAll(/\((.*?)\)/g);
        for (const p of parts) {
          fullText += p[1] + ' ';
        }
      }
      fullText += '\n';
    }

    // Unescape common PDF string characters
    const cleaned = fullText
      .replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
      .replace(/\\([()\\])/g, '$1')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    return cleaned;
  } catch (err) {
    console.warn('Client-side PDF extraction skipped:', err);
    return '';
  }
}
