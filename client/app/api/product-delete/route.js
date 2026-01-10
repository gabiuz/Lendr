import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { product_id, owner_id } = body;

    if (!product_id || !owner_id) {
      return NextResponse.json(
        { success: false, error: 'product_id and owner_id are required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const products = await query({
      query: 'SELECT owner_id FROM products WHERE product_id = ?',
      values: [product_id]
    });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (products[0].owner_id !== parseInt(owner_id)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete in order: reviews, payments, rentals, product images, product
    
    // 1. Delete reviews for this product
    await query({
      query: 'DELETE FROM reviews WHERE product_id = ?',
      values: [product_id]
    });

    // 2. Delete payments for rentals of this product
    await query({
      query: `
        DELETE FROM payments 
        WHERE rental_id IN (
          SELECT rental_id FROM rentals WHERE product_id = ?
        )
      `,
      values: [product_id]
    });

    // 3. Delete rentals for this product
    await query({
      query: 'DELETE FROM rentals WHERE product_id = ?',
      values: [product_id]
    });

    // 4. Delete product images
    await query({
      query: 'DELETE FROM products_image WHERE product_id = ?',
      values: [product_id]
    });

    // 5. Delete the product itself
    await query({
      query: 'DELETE FROM products WHERE product_id = ?',
      values: [product_id]
    });

    return NextResponse.json({
      success: true,
      message: 'Product and all associated records deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
