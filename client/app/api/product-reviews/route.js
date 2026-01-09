import { query } from '../../../source/database';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get('product_id');

    if (!product_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product ID is required' }),
        { status: 400 }
      );
    }

    const reviews = await query({
      query: `SELECT 
        r.review_id,
        r.rating,
        r.comment,
        r.created_at,
        c.customer_id,
        c.first_name,
        c.last_name
      FROM reviews r
      JOIN customer c ON r.customer_id = c.customer_id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC`,
      values: [product_id]
    });

    return new Response(
      JSON.stringify({
        success: true,
        reviews: reviews || []
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch reviews' }),
      { status: 500 }
    );
  }
}
