/**
 * Safe client-side fetch helper that handles empty responses, HTML error pages,
 * and JSON parsing errors gracefully without throwing "Unexpected end of JSON input".
 */
export async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (netErr: unknown) {
    const err = netErr as Error;
    throw new Error(`Network connection error: ${err?.message || 'Failed to reach server'}`);
  }

  const rawText = await response.text();
  let data: any = null;

  if (rawText && rawText.trim().length > 0) {
    try {
      data = JSON.parse(rawText);
    } catch {
      // Server returned HTML or raw text (e.g., 504 Gateway Timeout, 404, or Vercel edge error)
      const cleanPreview = rawText
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 140);
      throw new Error(
        `Server returned non-JSON response (${response.status} ${response.statusText}): ${
          cleanPreview || 'Invalid response from server'
        }`
      );
    }
  }

  if (!response.ok) {
    let errorMsg = data?.error;
    if (!errorMsg) {
      if (response.status === 500) {
        errorMsg = 'Server error (500). Please try again or paste resume text directly.';
      } else if (response.status === 504) {
        errorMsg = 'Request timed out (504). The service took too long to respond.';
      } else {
        errorMsg = `Request failed with status ${response.status} (${response.statusText || 'Server Error'})`;
      }
    }
    throw new Error(errorMsg);
  }

  if (!data) {
    throw new Error(
      `Server returned an empty response (Status: ${response.status}). Please try again.`
    );
  }

  return data as T;
}
