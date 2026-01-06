import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');
    if (!product_id) return NextResponse.json({ success: false, error: 'missing product_id' }, { status: 400 });

    // fetch product and include image paths from products_image and category
    const rows = await query({
      query: `SELECT p.*, ro.business_name, ro.business_address, ro.business_profile_picture as owner_avatar, c.category_type,
                cust.first_name as owner_first_name, cust.last_name as owner_last_name,
                pi.image_path1, pi.image_path2, pi.image_path3, pi.image_path4, pi.image_path5, pi.image_path6
              FROM products p
              LEFT JOIN rental_owner ro ON p.owner_id = ro.owner_id
              LEFT JOIN customer cust ON ro.customer_id = cust.customer_id
              LEFT JOIN categories c ON p.category_code = c.category_code
              LEFT JOIN products_image pi ON pi.product_id = p.product_id
              WHERE p.product_id = ? LIMIT 1`,
      values: [product_id],
    });

    if (!rows || rows.length === 0) return NextResponse.json({ success: false, error: 'not found' }, { status: 404 });

    const prod = rows[0];
    // build images array from available image_path fields
    const images = [];
    for (let i = 1; i <= 6; i++) {
      const key = `image_path${i}`;
      if (prod[key]) images.push(prod[key]);
    }

    // attach images array and keep individual fields for backwards compat
    prod.images = images;

    // fetch reviews for this product (join with customer for name/avatar)
    const reviewRows = await query({
      query: `SELECT r.review_id, r.rating, r.comment, r.created_at,
                     c.customer_id, c.first_name, c.last_name, c.user_profile_picture
              FROM reviews r
              LEFT JOIN customer c ON r.customer_id = c.customer_id
              WHERE r.product_id = ?
              ORDER BY r.created_at DESC`,
      values: [product_id],
    });

    const reviews = (reviewRows || []).map((r) => ({
      review_id: r.review_id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      customer: {
        customer_id: r.customer_id,
        name: r.first_name && r.last_name ? `${r.first_name} ${r.last_name}` : null,
        avatar: r.user_profile_picture || '/pictures/sample-pfp-productCard.png',
      },
    }));

    prod.reviews = reviews;

    return NextResponse.json({ success: true, product: prod });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
