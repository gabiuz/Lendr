import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner_id = searchParams.get('owner_id');

    if (!owner_id) {
      return NextResponse.json({ success: false, error: 'missing owner_id' }, { status: 400 });
    }

    const productsCountRows = await query({
      query: 'SELECT COUNT(*) AS count FROM products WHERE owner_id = ?',
      values: [owner_id],
    });

    const activeRentalsRows = await query({
      query:
        'SELECT COUNT(*) AS count FROM rentals r JOIN products p ON r.product_id = p.product_id WHERE p.owner_id = ? AND r.status <> "Completed"',
      values: [owner_id],
    });

    const totalEarningsRows = await query({
      query:
        'SELECT IFNULL(SUM(r.total_amount),0) AS total FROM rentals r JOIN products p ON r.product_id = p.product_id WHERE p.owner_id = ? AND r.status = "Completed"',
      values: [owner_id],
    });

    const avgRatingRows = await query({
      query:
        'SELECT AVG(rv.rating) AS avg_rating FROM reviews rv JOIN products p ON rv.product_id = p.product_id WHERE p.owner_id = ?',
      values: [owner_id],
    });

    const stats = {
      products: Number(productsCountRows[0]?.count ?? 0),
      activeRentals: Number(activeRentalsRows[0]?.count ?? 0),
      totalEarnings: Number(totalEarningsRows[0]?.total ?? 0),
      avgRating: avgRatingRows[0] && avgRatingRows[0].avg_rating !== null ? Number(Number(avgRatingRows[0].avg_rating).toFixed(1)) : null,
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
