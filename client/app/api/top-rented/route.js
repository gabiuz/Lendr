import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';

export async function GET(request) {
  try {
    // Return top rented products (by rental count), include owner info
    const sql = `
      SELECT p.*, ro.business_name, ro.business_address, IFNULL(rc.cnt,0) AS rental_count
      FROM products p
      LEFT JOIN rental_owner ro ON p.owner_id = ro.owner_id
      LEFT JOIN (
        SELECT product_id, COUNT(*) AS cnt FROM rentals GROUP BY product_id
      ) rc ON rc.product_id = p.product_id
      ORDER BY rc.cnt DESC
      LIMIT 12
    `;

    const rows = await query({ query: sql, values: [] });
    return NextResponse.json({ success: true, products: rows });
  } catch (err) {
    console.error('Error fetching top rented:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
