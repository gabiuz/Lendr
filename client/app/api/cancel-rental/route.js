import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function POST(request) {
  try {
    const { rental_id, customer_id } = await request.json();

    if (!rental_id || !customer_id) {
      return NextResponse.json(
        { success: false, error: 'Missing rental_id or customer_id' },
        { status: 400 }
      );
    }

    // Verify the rental belongs to the customer
    const rentalRows = await query({
      query: 'SELECT * FROM rentals WHERE rental_id = ? AND customer_id = ?',
      values: [rental_id, customer_id],
    });

    if (!rentalRows || rentalRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Rental not found or does not belong to this customer' },
        { status: 404 }
      );
    }

    const rental = rentalRows[0];

    // Check if rental has not started (status is 'To ship' or 'Pending' or 'Reserved')
    const notStartedStatuses = ['To ship', 'Pending', 'Reserved'];
    if (!notStartedStatuses.includes(rental.status)) {
      return NextResponse.json(
        { success: false, error: `Cannot cancel rental with status: ${rental.status}` },
        { status: 400 }
      );
    }

    // Update rental status to 'Cancelled'
    await query({
      query: 'UPDATE rentals SET status = ? WHERE rental_id = ?',
      values: ['Cancelled', rental_id],
    });

    // Update payment status to 'Cancelled' if payment record exists
    await query({
      query: 'UPDATE payments SET payment_status = ? WHERE rental_id = ?',
      values: ['Cancelled', rental_id],
    });

    return NextResponse.json(
      { success: true, message: 'Rental cancelled successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error cancelling rental:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
