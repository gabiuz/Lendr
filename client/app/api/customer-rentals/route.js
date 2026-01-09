import { query } from '@/source/database.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');

    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
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
          p.description,
          pi.image_path1 as image_path,
          cat.category_type,
          ro.business_name,
          ro.business_address,
          ro.owner_id,
          ro.business_profile_picture,
          r.start_date as rental_start,
          r.end_date as rental_end,
          r.total_amount as total_cost,
          r.status
        FROM rentals r
        JOIN products p ON r.product_id = p.product_id
        JOIN rental_owner ro ON p.owner_id = ro.owner_id
        LEFT JOIN products_image pi ON p.product_id = pi.product_id
        LEFT JOIN categories cat ON p.category_code = cat.category_code
        WHERE r.customer_id = ?
        ORDER BY r.start_date DESC
      `,
      values: [customerId]
    });

    return NextResponse.json({
      success: true,
      rentals: results || []
    });
  } catch (err) {
    console.error('Error fetching customer rentals:', err);
    return NextResponse.json(
      { success: false, message: 'Database error', error: err.message },
      { status: 500 }
    );
  }
}
