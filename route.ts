import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (!id) return NextResponse.json({ job: null });

  const db = getDB();
  const job = await db
    .prepare('SELECT id, title FROM jobs WHERE id = ? AND is_open = 1')
    .bind(id)
    .first<{ id: number; title: string }>();

  return NextResponse.json({ job: job ?? null });
}
