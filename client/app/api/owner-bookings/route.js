import { query } from '@/source/database.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('owner_id');

    if (!ownerId) {
      return NextResponse.json(
        { success: false, message: 'Owner ID is required' },
        { status: 400 }
      );
    }

    const results = await query({
      query: `
        SELECT 
          r.rental_id,
          p.product_id,
          p.product_name,
          p.product_rate,
          p.availability_status,
          p.description,
          pi.image_path1 as image_path,
          cat.category_type,
          c.first_name,
          c.last_name,
          r.start_date,
          r.end_date,
          r.total_amount,
          r.status as rental_status
        FROM rentals r
        JOIN products p ON r.product_id = p.product_id
        JOIN customer c ON r.customer_id = c.customer_id
        LEFT JOIN products_image pi ON p.product_id = pi.product_id
        LEFT JOIN categories cat ON p.category_code = cat.category_code
        WHERE p.owner_id = ?
        ORDER BY r.start_date ASC
      `,
      values: [ownerId]
    });

    return NextResponse.json({
      success: true,
      bookings: results || []
    });
  } catch (err) {
    console.error('Error fetching owner bookings:', err);
    return NextResponse.json(
      { success: false, message: 'Database error', error: err.message },
      { status: 500 }
    );
  }
}
