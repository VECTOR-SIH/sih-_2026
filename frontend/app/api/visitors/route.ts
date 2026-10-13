import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    // Hits.sh global CDN-backed hit counter with extraCount baseline
    const res = await fetch('https://hits.sh/vectornet-sih-2026.vercel.app.svg?extraCount=2840', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'VectorNet-Global-Visitor-Sync/1.0',
      },
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const text = await res.text();
      const match = text.match(/aria-label="hits:\s*([\d,]+)"/i) || text.match(/<title>hits:\s*([\d,]+)<\/title>/i);
      if (match && match[1]) {
        const rawNumber = match[1].replace(/,/g, '');
        const count = parseInt(rawNumber, 10);
        if (!isNaN(count) && count > 0) {
          return NextResponse.json({ count, source: 'global' });
        }
      }
    }
  } catch {
    // Fallback if network issue
  }

  return NextResponse.json({ count: 2848, source: 'fallback' });
}
