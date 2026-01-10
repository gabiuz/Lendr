import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { product_id, availability_status } = body;

    // Validate inputs
    if (!product_id || !availability_status) {
      return NextResponse.json(
        { success: false, error: 'product_id and availability_status are required' },
        { status: 400 }
      );
    }

    // Update the product availability status
    const result = await query({
      query: 'UPDATE products SET availability_status = ? WHERE product_id = ?',
      values: [availability_status, product_id],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated product status to ${availability_status}`,
    });
  } catch (error) {
    console.error('Error updating product status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
