import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner_id = searchParams.get('owner_id');

    if (!owner_id) {
      return NextResponse.json({ success: false, error: 'missing owner_id' }, { status: 400 });
    }

    // Total products count
    const productsCountRows = await query({
      query: 'SELECT COUNT(*) AS count FROM products WHERE owner_id = ?',
      values: [owner_id],
    });

    // Active rentals count
    const activeRentalsRows = await query({
      query:
        'SELECT COUNT(*) AS count FROM rentals r JOIN products p ON r.product_id = p.product_id WHERE p.owner_id = ? AND r.status != "Completed"',
      values: [owner_id],
    });

    // Top earning product (this month)
    const topEarningRows = await query({
      query: `
        SELECT p.product_id, p.product_name, SUM(r.total_amount) AS earnings
        FROM rentals r
        JOIN products p ON r.product_id = p.product_id
        WHERE p.owner_id = ? AND MONTH(r.payment_id) = MONTH(NOW()) AND YEAR(r.payment_id) = YEAR(NOW())
        GROUP BY p.product_id
        ORDER BY earnings DESC
        LIMIT 1
      `,
      values: [owner_id],
    });

    // Monthly revenue (all months, current year)
    const monthlyRevenueRows = await query({
      query: `
        SELECT 
          MONTH(r.payment_id) AS month,
          SUM(r.total_amount) AS total
        FROM rentals r
        JOIN products p ON r.product_id = p.product_id
        WHERE p.owner_id = ? AND YEAR(r.payment_id) = YEAR(NOW())
        GROUP BY MONTH(r.payment_id)
        ORDER BY month ASC
      `,
      values: [owner_id],
    });

    // Total monthly revenue (current month)
    const currentMonthRevenueRows = await query({
      query: `
        SELECT SUM(r.total_amount) AS total
        FROM rentals r
        JOIN products p ON r.product_id = p.product_id
        WHERE p.owner_id = ? AND MONTH(r.payment_id) = MONTH(NOW()) AND YEAR(r.payment_id) = YEAR(NOW())
      `,
      values: [owner_id],
    });

    // Most rented category
    const mostRentedCategoryRows = await query({
      query: `
        SELECT 
          c.category_code,
          c.category_type,
          COUNT(r.rental_id) AS rental_count
        FROM rentals r
        JOIN products p ON r.product_id = p.product_id
        JOIN categories c ON p.category_code = c.category_code
        WHERE p.owner_id = ?
        GROUP BY c.category_code
        ORDER BY rental_count DESC
        LIMIT 1
      `,
      values: [owner_id],
    });

    // All category breakdown
    const categoryBreakdownRows = await query({
      query: `
        SELECT 
          c.category_type,
          COUNT(p.product_id) AS product_count
        FROM products p
        JOIN categories c ON p.category_code = c.category_code
        WHERE p.owner_id = ?
        GROUP BY c.category_type
      `,
      values: [owner_id],
    });

    // Customer rating
    const ratingRows = await query({
      query: `
        SELECT AVG(rv.rating) AS avg_rating
        FROM reviews rv
        JOIN products p ON rv.product_id = p.product_id
        WHERE p.owner_id = ?
      `,
      values: [owner_id],
    });

    // Build monthly revenue array (12 months)
    const monthlyRevenue = Array(12).fill(0);
    monthlyRevenueRows.forEach(row => {
      monthlyRevenue[row.month - 1] = Number(row.total || 0);
    });

    const profileStats = {
      products: Number(productsCountRows[0]?.count ?? 0),
      activeRentals: Number(activeRentalsRows[0]?.count ?? 0),
      topEarningProduct: topEarningRows[0] ? {
        name: topEarningRows[0].product_name,
        earnings: Number(topEarningRows[0].earnings || 0),
      } : {
        name: 'No rentals yet',
        earnings: 0,
      },
      currentMonthRevenue: Number(currentMonthRevenueRows[0]?.total ?? 0),
      monthlyRevenue: monthlyRevenue,
      mostRentedCategory: mostRentedCategoryRows[0] ? {
        name: mostRentedCategoryRows[0].category_type,
        count: mostRentedCategoryRows[0].rental_count,
      } : {
        name: 'N/A',
        count: 0,
      },
      categoryBreakdown: categoryBreakdownRows || [],
      customerRating: ratingRows[0]?.avg_rating 
        ? Number(Number(ratingRows[0].avg_rating).toFixed(1)) 
        : null,
    };

    return NextResponse.json({ success: true, stats: profileStats });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
