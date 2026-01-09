import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function GET(request) {
  try {
    const categories = await query({
      query: `SELECT category_code, category_type FROM categories ORDER BY category_type ASC`
    });

    return NextResponse.json({
      success: true,
      categories: categories || []
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
