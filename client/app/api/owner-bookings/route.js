import mysql from 'mysql2';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get('owner_id');

  if (!ownerId) {
    return Response.json(
      { success: false, message: 'Owner ID is required' },
      { status: 400 }
    );
  }

  return new Promise((resolve) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'lendr'
    });

    connection.connect();

    const query = `
      SELECT 
        r.rental_id,
        p.product_id,
        p.product_name,
        p.product_rate,
        p.availability_status,
        p.description,
        pi.image_path1 as image_path,
        cat.category_type,
        c.first_name,
        c.last_name,
        r.start_date,
        r.end_date,
        r.total_amount,
        r.status as rental_status
      FROM rentals r
      JOIN products p ON r.product_id = p.product_id
      JOIN customer c ON r.customer_id = c.customer_id
      LEFT JOIN products_image pi ON p.product_id = pi.product_id
      LEFT JOIN categories cat ON p.category_code = cat.category_code
      WHERE p.owner_id = ?
      ORDER BY r.start_date DESC
    `;

    connection.query(query, [ownerId], (err, results) => {
      connection.end();

      if (err) {
        console.error('Database error:', err);
        resolve(
          Response.json(
            { success: false, message: 'Database error' },
            { status: 500 }
          )
        );
        return;
      }

      resolve(
        Response.json({
          success: true,
          bookings: results || []
        })
      );
    });
  });
}
