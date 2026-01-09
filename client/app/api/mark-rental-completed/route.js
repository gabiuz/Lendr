import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { rental_id, product_id, owner_id } = body;

    if (!rental_id || !product_id || !owner_id) {
      return NextResponse.json({ success: false, error: 'rental_id, product_id and owner_id are required' }, { status: 400 });
    }

    // Verify that this product belongs to the owner
    const rows = await query({
      query: `SELECT p.owner_id FROM products p WHERE p.product_id = ? LIMIT 1`,
      values: [product_id]
    });

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const productOwner = rows[0].owner_id;
    if (String(productOwner) !== String(owner_id)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch rental to validate end_date and current status
    const rentalRows = await query({
      query: `SELECT end_date, status FROM rentals WHERE rental_id = ? LIMIT 1`,
      values: [rental_id]
    });

    if (!rentalRows || rentalRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Rental not found' }, { status: 404 });
    }

    const rental = rentalRows[0];

    // Prevent marking as Completed if it's already completed
    if (String(rental.status).toLowerCase() === 'completed') {
      return NextResponse.json({ success: false, error: 'Rental already completed' }, { status: 400 });
    }

    // Compare dates (only date portion) to prevent marking completed before end_date
    const todayStr = new Date().toISOString().slice(0, 10);
    const endDateStr = new Date(rental.end_date).toISOString().slice(0, 10);

    if (todayStr < endDateStr) {
      return NextResponse.json({ success: false, error: 'Cannot mark rental as Completed before its end date' }, { status: 400 });
    }

    // Update rental status
    await query({
      query: `UPDATE rentals SET status = 'Completed' WHERE rental_id = ?`,
      values: [rental_id]
    });

    // Update product availability
    await query({
      query: `UPDATE products SET availability_status = 'Available' WHERE product_id = ?`,
      values: [product_id]
    });

    return NextResponse.json({ success: true, message: 'Rental marked as Completed' });
  } catch (err) {
    console.error('Error marking rental completed:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
