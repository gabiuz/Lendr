import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

        // Base select joining owner info and include primary image and category type
        let sql = `SELECT p.*, ro.business_name, ro.business_address, ro.business_profile_picture as owner_avatar, c.category_type,
            (SELECT image_path1 FROM products_image pi WHERE pi.product_id = p.product_id LIMIT 1) as image_path
          FROM products p
          LEFT JOIN rental_owner ro ON p.owner_id = ro.owner_id
          LEFT JOIN categories c ON p.category_code = c.category_code`;
    const where = [];
    const values = [];

    if (q) {
      where.push('(p.product_name LIKE ? OR p.description LIKE ?)');
      values.push(`%${q}%`, `%${q}%`);
    }

    if (location) {
      where.push('ro.business_address LIKE ?');
      values.push(`%${location}%`);
    }

    if (category) {
      where.push('p.category_code = ?');
      values.push(category);
    }

    if (where.length) sql += ' WHERE ' + where.join(' AND ');

    // If date range provided, exclude products that have overlapping rentals
    // We'll fetch candidate products first, then if dates provided, filter out unavailable ones
    const rows = await query({ query: sql, values });

    let products = rows || [];

    if (startDate && endDate) {
      // find product_ids that have overlapping rentals
      const overlapSql = `SELECT DISTINCT product_id FROM rentals WHERE NOT (end_date < ? OR start_date > ?)`;
      const overlapRows = await query({ query: overlapSql, values: [startDate, endDate] });
      const unavailable = new Set((overlapRows || []).map(r => r.product_id));
      products = products.filter(p => !unavailable.has(p.product_id));
    }

    return NextResponse.json({ success: true, products });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
