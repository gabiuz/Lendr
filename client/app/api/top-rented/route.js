import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function GET(request) {
  try {
    // Return top rented products (by rental count), include owner info
    // Exclude unavailable products from customer view
    const sql = `
      SELECT p.*, ro.business_name, ro.business_address, ro.business_profile_picture as owner_avatar, IFNULL(rc.cnt,0) AS rental_count,
             c.category_type,
             (SELECT image_path1 FROM products_image pi WHERE pi.product_id = p.product_id LIMIT 1) as image_path
      FROM products p
      LEFT JOIN rental_owner ro ON p.owner_id = ro.owner_id
      LEFT JOIN categories c ON p.category_code = c.category_code
      LEFT JOIN (
        SELECT product_id, COUNT(*) AS cnt FROM rentals GROUP BY product_id
      ) rc ON rc.product_id = p.product_id
      WHERE p.availability_status != ?
      ORDER BY rc.cnt DESC
      LIMIT 12
    `;

    const rows = await query({ query: sql, values: ['Unavailable'] });
    return NextResponse.json({ success: true, products: rows });
  } catch (err) {
    console.error('Error fetching top rented:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
