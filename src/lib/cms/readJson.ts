import 'server-only';

/** Roughly 64 KB — far above any legitimate request this app makes. */
const DEFAULT_MAX_BYTES = 64 * 1024;

export type JsonResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: number; error: string };

/**
 * Reads a JSON body with a hard ceiling.
 *
 * `request.json()` buffers whatever arrives before any validation runs, so an
 * unauthenticated caller could hand a multi-megabyte document to endpoints
 * like checkout and make the server parse all of it. Oversized requests are
 * now rejected without being parsed.
 */
export async function readJson(
  request: Request,
  maxBytes: number = DEFAULT_MAX_BYTES,
): Promise<JsonResult> {
  const declared = Number(request.headers.get('content-length') ?? '');
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, status: 413, error: 'Request is too large' };
  }

  // Content-Length can lie or be absent (chunked), so count what actually arrives.
  let text: string;
  try {
    const reader = request.body?.getReader();
    if (!reader) {
      text = await request.text();
      if (text.length > maxBytes) return { ok: false, status: 413, error: 'Request is too large' };
    } else {
      const chunks: Uint8Array[] = [];
      let total = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > maxBytes) {
          await reader.cancel().catch(() => undefined);
          return { ok: false, status: 413, error: 'Request is too large' };
        }
        chunks.push(value);
      }
      text = new TextDecoder().decode(
        chunks.reduce((acc, c) => {
          const merged = new Uint8Array(acc.length + c.length);
          merged.set(acc);
          merged.set(c, acc.length);
          return merged;
        }, new Uint8Array()),
      );
    }
  } catch {
    return { ok: false, status: 400, error: 'Could not read the request' };
  }

  try {
    const parsed = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null) {
      return { ok: false, status: 400, error: 'Invalid request body' };
    }
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400, error: 'Invalid JSON' };
  }
}
