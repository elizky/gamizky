import { NextResponse } from 'next/server';
import { db } from '@/server/db/prisma';

export async function GET() {
  try {
    const categories = await db.taskCategory.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching task categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task categories' },
      { status: 500 }
    );
  }
}
