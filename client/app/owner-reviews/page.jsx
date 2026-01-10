"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OwnerReviews() {
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Sample reviews data - this would come from an API in production
  const allReviews = [
    {
      customerName: "Juan Dela Cruz",
      product: "Power Drill",
      rating: 4.5,
      comment: "Works great and owner was responsive!",
      date: "Oct 12, 2025"
    },
    {
      customerName: "Ana Reyes",
      product: "Toyota Vios",
      rating: 4.5,
      comment: "Smooth transaction!",
      date: "Oct 11, 2025"
    }
  ];

  // Filter reviews based on selected star rating
  const filteredReviews = selectedFilter
    ? allReviews.filter(review => Math.floor(review.rating) === selectedFilter)
    : allReviews;

  // Render star icons
  const renderStars = (rating, size = "w-4 h-4") => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const isHalfStar = rating >= starValue - 0.5 && rating < starValue;
      const isFullStar = rating >= starValue;
      
      return (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill={isFullStar ? "#FCD34D" : "none"}
          xmlns="http://www.w3.org/2000/svg"
          className={size}
        >
          {isHalfStar ? (
            <defs>
              <linearGradient id={`half-star-${i}`}>
                <stop offset="50%" stopColor="#FCD34D" />
                <stop offset="50%" stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
          ) : null}
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={isHalfStar ? `url(#half-star-${i})` : isFullStar ? "#FCD34D" : "#E5E7EB"}
          />
        </svg>
      );
    });
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar
        links={[
          {
            href: "/owner-homepage",
            label: "Home",
          },
          {
            href: "/browse-rentals",
            label: "Browse Rentals",
          },
          {
            href: "/owner-booking",
            label: "Bookings",
          },
          {
            href: "/owner-payments",
            label: "Payments",
          },
          {
            href: "/about-us",
            label: "About Us",
          }
        ]}
        showOwnerButton={false}
        profileInCircle={true}
      />

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-20 xl:px-36 py-8 md:py-12 lg:mt-24">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <a href="/owner-homepage" className="text-gray-600 hover:text-red-600 transition-colors">
            Home
          </a>
          <span className="text-gray-400">›</span>
          <a href="/owner-rentals" className="text-gray-600 hover:text-red-600 transition-colors">
            My Rentals
          </a>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900 font-medium">Edit Products</span>
        </div>

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
            Reviews
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            View your reviews, all in one place.
          </p>
        </div>

        {/* Star Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[5, 4, 3, 2, 1].map(stars => (
            <button
              key={stars}
              onClick={() => setSelectedFilter(selectedFilter === stars ? null : stars)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-all ${
                selectedFilter === stars
                  ? 'bg-red-50 border-red-600 text-red-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <span className="font-medium">{stars} Star{stars > 1 ? 's' : ''}</span>
              <div className="flex gap-0.5">
                {renderStars(stars, "w-3.5 h-3.5")}
              </div>
            </button>
          ))}
        </div>

        {/* Reviews Cards */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-400 text-lg">No reviews found for this filter</p>
            </div>
          ) : (
            filteredReviews.map((review, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-blue-600 font-semibold text-base">
                        {review.customerName}
                      </h3>
                      <span className="text-gray-800 font-medium">{review.rating}</span>
                      <div className="flex gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      &quot;{review.comment}&quot;
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-gray-600 text-sm mb-1">{review.date}</p>
                    <p className="text-gray-900 font-semibold text-sm">{review.product}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}