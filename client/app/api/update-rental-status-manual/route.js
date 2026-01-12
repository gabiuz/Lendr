import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

// Helper function to update product availability status based on rental status
async function updateProductAvailabilityStatus(product_id) {
  try {
    // Check if there are any active rentals with status "Out for Delivery", "Delivered", or "Return Shipped"
    const activeRentals = await query({
      query: `SELECT rental_id FROM rentals 
              WHERE product_id = ? AND status IN ('Out for Delivery', 'Delivered', 'Return Shipped')
              LIMIT 1`,
      values: [product_id],
    });

    if (activeRentals && activeRentals.length > 0) {
      // Product has active rentals with these statuses, set to "Rented"
      await query({
        query: 'UPDATE products SET availability_status = ? WHERE product_id = ?',
        values: ['Rented', product_id],
      });
    } else {
      // No active rentals with those statuses, set to "Available"
      await query({
        query: 'UPDATE products SET availability_status = ? WHERE product_id = ?',
        values: ['Available', product_id],
      });
    }
  } catch (error) {
    console.error('Error updating product availability status:', error);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { rental_id, status } = body;

    // Validate inputs
    if (!rental_id || !status) {
      return NextResponse.json(
        { success: false, error: 'rental_id and status are required' },
        { status: 400 }
      );
    }

    // Get product_id for this rental
    const rentalData = await query({
      query: 'SELECT product_id FROM rentals WHERE rental_id = ?',
      values: [rental_id],
    });

    if (!rentalData || rentalData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Rental not found' },
        { status: 404 }
      );
    }

    const product_id = rentalData[0].product_id;

    // Update the rental status
    const result = await query({
      query: 'UPDATE rentals SET status = ? WHERE rental_id = ?',
      values: [status, rental_id],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Rental not found' },
        { status: 404 }
      );
    }

    // Update product availability status based on all its rentals
    if (product_id) {
      await updateProductAvailabilityStatus(product_id);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated rental status to ${status}`,
    });
  } catch (error) {
    console.error('Error updating rental status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
