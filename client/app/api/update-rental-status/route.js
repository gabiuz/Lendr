import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function POST(request) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Find all rentals where end_date has passed and status is not "Completed"
    const expiredRentals = await query({
      query: `SELECT rental_id, product_id FROM rentals 
              WHERE end_date < ? AND status != 'Completed'`,
      values: [today],
    });

    if (!expiredRentals || expiredRentals.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No rentals to update',
        updatedCount: 0,
      });
    }

    // Update each rental status to "Completed"
    for (const rental of expiredRentals) {
      // Update rental status
      await query({
        query: 'UPDATE rentals SET status = ? WHERE rental_id = ?',
        values: ['Completed', rental.rental_id],
      });

      // Update product availability status back to "Available"
      await query({
        query: 'UPDATE products SET availability_status = ? WHERE product_id = ?',
        values: ['Available', rental.product_id],
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${expiredRentals.length} rental(s) to Completed`,
      updatedCount: expiredRentals.length,
    });
  } catch (error) {
    console.error('Error updating rental status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get rentals that need updating (for monitoring purposes)
    const expiredRentals = await query({
      query: `SELECT r.rental_id, r.product_id, r.end_date, r.status, p.product_name
              FROM rentals r
              LEFT JOIN products p ON r.product_id = p.product_id
              WHERE r.end_date < ? AND r.status != 'Completed'
              ORDER BY r.end_date ASC`,
      values: [today],
    });

    return NextResponse.json({
      success: true,
      expiredRentalsCount: expiredRentals ? expiredRentals.length : 0,
      expiredRentals: expiredRentals || [],
    });
  } catch (error) {
    console.error('Error fetching expired rentals:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
