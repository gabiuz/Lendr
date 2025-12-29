import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');
    if (!product_id) return NextResponse.json({ success: false, error: 'missing product_id' }, { status: 400 });

    const rows = await query({ query: `SELECT p.*, ro.business_name, ro.business_address FROM products p LEFT JOIN rental_owner ro ON p.owner_id = ro.owner_id WHERE p.product_id = ?`, values: [product_id] });
    if (!rows || rows.length === 0) return NextResponse.json({ success: false, error: 'not found' }, { status: 404 });

    return NextResponse.json({ success: true, product: rows[0] });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
