import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const ownerId = searchParams.get('owner_id');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'product_id is required' },
        { status: 400 }
      );
    }

    // Fetch product with all related data
    const products = await query({
      query: `
        SELECT 
          p.product_id,
          p.owner_id,
          p.product_name,
          p.description,
          p.product_rate,
          p.availability_status,
          p.category_code,
          c.category_type,
          pi.image_path1,
          pi.image_path2,
          pi.image_path3,
          pi.image_path4,
          pi.image_path5,
          pi.image_path6,
          ro.business_address
        FROM products p
        LEFT JOIN categories c ON p.category_code = c.category_code
        LEFT JOIN products_image pi ON p.product_id = pi.product_id
        LEFT JOIN rental_owner ro ON p.owner_id = ro.owner_id
        WHERE p.product_id = ?
      `,
      values: [productId]
    });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = products[0];

    // Verify ownership if owner_id is provided
    if (ownerId && product.owner_id !== parseInt(ownerId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Build images array
    const images = [
      product.image_path1,
      product.image_path2,
      product.image_path3,
      product.image_path4,
      product.image_path5,
      product.image_path6
    ].filter(Boolean);

    return NextResponse.json({
      success: true,
      product: {
        product_id: product.product_id,
        product_name: product.product_name,
        description: product.description,
        product_rate: product.product_rate,
        availability_status: product.availability_status,
        category_code: product.category_code,
        category_type: product.category_type,
        business_address: product.business_address,
        owner_id: product.owner_id,
        images: images
      }
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      product_id,
      owner_id,
      product_name,
      description,
      product_rate,
      availability_status,
      category_code
    } = body;

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

    // Update product
    await query({
      query: `
        UPDATE products 
        SET product_name = ?, description = ?, product_rate = ?, availability_status = ?, category_code = ?
        WHERE product_id = ?
      `,
      values: [product_name, description, product_rate, availability_status, category_code, product_id]
    });

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (err) {
    console.error('Error updating product:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
