import { query } from '@/source/database.js';
import { NextResponse } from 'next/server';

async function generateReviewId() {
  // Get max review_id from database and increment
  try {
    const result = await query({
      query: 'SELECT MAX(CAST(review_id AS UNSIGNED)) as maxId FROM reviews'
    });
    
    const maxId = result[0]?.maxId || 0;
    return String(maxId + 1);
  } catch (err) {
    // Fallback to timestamp-based ID if query fails
    return String(Math.floor(Date.now() / 1000));
  }
}

export async function POST(request) {
  try {
    const { customerId, productId, rating, comment } = await request.json();

    console.log('Submit review request:', { customerId, productId, rating, comment });

    if (!customerId || !productId || !rating) {
      return NextResponse.json(
        { success: false, message: 'Customer ID, Product ID, and Rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const reviewId = await generateReviewId();
    const createdAt = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    const result = await query({
      query: `
        INSERT INTO reviews (review_id, product_id, customer_id, rating, comment, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      values: [reviewId, productId, customerId, parseInt(rating), comment || null, createdAt]
    });

    console.log('Review inserted successfully:', reviewId);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your review! Your rating has been submitted.',
      reviewId: reviewId
    });
  } catch (err) {
    console.error('Error submitting review:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to submit review: ' + (err.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
