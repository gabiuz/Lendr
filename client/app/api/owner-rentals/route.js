import { query } from '@/source/database';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const owner_id = searchParams.get('owner_id');

  if (!owner_id) {
    return Response.json({ success: false, error: 'owner_id is required' }, { status: 400 });
  }

  try {
    // Get ongoing rentals for the owner's products
    const rentals = await query({
      query: `
        SELECT 
          r.rental_id,
          p.product_id,
          p.product_name,
          c.first_name,
          c.last_name,
          r.start_date,
          r.end_date,
          r.total_amount,
          r.status
        FROM rentals r
        JOIN products p ON r.product_id = p.product_id
        JOIN customer c ON r.customer_id = c.customer_id
        WHERE p.owner_id = ? AND r.status != 'Completed'
        ORDER BY r.start_date DESC
      `,
      values: [owner_id]
    });

    return Response.json({ 
      success: true, 
      rentals: rentals || []
    });
  } catch (err) {
    console.error('Error fetching owner rentals:', err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
