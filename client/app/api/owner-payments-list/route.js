import { query } from '@/source/database.js';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const owner_id = searchParams.get('owner_id');
  const status = searchParams.get('status');

  if (!owner_id) {
    return Response.json({ success: false, error: 'owner_id is required' }, { status: 400 });
  }

  try {
    let statusFilter = '';
    let values = [owner_id];

    if (status && status !== 'all') {
      // For all statuses, filter by payment_status
      statusFilter = ' AND pa.payment_status = ?';
      values.push(status.charAt(0).toUpperCase() + status.slice(1));
    }

    // Get completed rentals (payments) for the owner's products
    const payments = await query({
      query: `
        SELECT 
          r.rental_id,
          p.product_id,
          p.product_name,
          p.product_rate,
          (SELECT image_path1 FROM products_image pi WHERE pi.product_id = p.product_id LIMIT 1) as product_image,
          c.first_name,
          c.last_name,
          c.customer_id,
          c.email,
          c.phone_number,
          c.address,
          cat.category_type,
          r.start_date,
          r.end_date,
          r.total_amount,
          r.status,
          pa.payment_status
        FROM rentals r
        JOIN products p ON r.product_id = p.product_id
        JOIN customer c ON r.customer_id = c.customer_id
        JOIN categories cat ON p.category_code = cat.category_code
        LEFT JOIN payments pa ON r.rental_id = pa.rental_id
        WHERE p.owner_id = ?${statusFilter}
        ORDER BY r.start_date DESC
      `,
      values: values
    });

    return Response.json({ 
      success: true, 
      payments: payments || []
    });
  } catch (err) {
    console.error('Error fetching owner payments:', err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
