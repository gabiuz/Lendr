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
  console.log('[update-rental-status POST] Starting...');
  
  try {
    const { searchParams } = new URL(request.url);
    const rental_id = searchParams.get('rental_id');
    const status = searchParams.get('status');

    console.log('[update-rental-status POST] Received via query params:', { rental_id, status });

    // If rental_id and status are provided, update that specific rental
    if (rental_id && status) {
      // Validate the status
      const validStatuses = ['To ship', 'Shipped', 'Out for Delivery', 'Delivered', 'Return Shipped', 'Return Received', 'Completed', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        console.error('[update-rental-status] Invalid status:', status);
        return NextResponse.json(
          { success: false, error: `Invalid status: ${status}` },
          { status: 400 }
        );
      }

      console.log('[update-rental-status] Updating rental', rental_id, 'to status:', status);
      
      try {
        // Get the product_id for this rental
        const rentalData = await query({
          query: 'SELECT product_id FROM rentals WHERE rental_id = ?',
          values: [rental_id],
        });

        const product_id = rentalData?.[0]?.product_id;

        const updateResult = await query({
          query: 'UPDATE rentals SET status = ? WHERE rental_id = ?',
          values: [status, rental_id],
        });

        console.log('[update-rental-status] Update result:', updateResult);

        // Update product availability status based on all its rentals
        if (product_id) {
          await updateProductAvailabilityStatus(product_id);
        }

        const responseData = {
          success: true,
          message: `Rental status updated to ${status}`,
        };

        console.log('[update-rental-status] Returning response:', responseData);
        return NextResponse.json(responseData);
      } catch (dbError) {
        console.error('[update-rental-status] Database error:', dbError);
        return NextResponse.json(
          { success: false, error: 'Database update failed: ' + dbError.message },
          { status: 500 }
        );
      }
    }

    // Otherwise, auto-update expired rentals (legacy behavior)
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

      // Update product availability status based on all its rentals
      await updateProductAvailabilityStatus(rental.product_id);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${expiredRentals.length} rental(s) to Completed`,
      updatedCount: expiredRentals.length,
    });
  } catch (error) {
    console.error('[update-rental-status POST Error]', error);
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
