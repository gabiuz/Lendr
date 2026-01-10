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

    // Get all reviewed rentals for this customer (rentals that have reviews)
    const reviewedRentals = await query({
      query: `
        SELECT DISTINCT rental_id
        FROM reviews
        WHERE customer_id = ?
      `,
      values: [customerId]
    });

    // Extract rental IDs into array
    const reviewedRentalIds = reviewedRentals.map(r => r.rental_id);

    return NextResponse.json({
      success: true,
      reviewedRentalIds: reviewedRentalIds || []
    });
  } catch (err) {
    console.error('Error fetching customer reviews:', err);
    return NextResponse.json(
      { success: false, message: 'Database error', error: err.message },
      { status: 500 }
    );
  }
}
