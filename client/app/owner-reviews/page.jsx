"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OwnerReviews() {
  // Sample reviews data - this would come from an API in production
  const reviews = [
    {
      customerName: "Juan Dela Cruz",
      product: "Power Drill",
      rating: 4.5,
      comment: "Works great and owner was responsive!",
      date: "Oct 11, 2025"
    }
  ];

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
            Manage your products, all in one place.
          </p>
        </div>

        {/* Reviews Table */}
        <div className="bg-white border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-100 border-b-2 border-gray-200">
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Customer Name
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Product
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Rating
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Comment
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 md:py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-3 md:gap-4">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="md:w-16 md:h-16"
                        >
                          <path
                            d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 12C43.046 12 52 20.954 52 32C52 43.046 43.046 52 32 52C20.954 52 12 43.046 12 32C12 20.954 20.954 12 32 12ZM28 24V28H36V24H28ZM28 32V44H36V32H28Z"
                            fill="#d1d5db"
                          />
                        </svg>
                        <p className="text-base md:text-lg font-medium">No reviews yet</p>
                        <p className="text-xs md:text-sm">
                          Your customer reviews will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reviews.map((review, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 md:py-4 px-3 md:px-6 text-sky-800 font-medium text-xs md:text-sm">
                        {review.customerName}
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6 text-gray-800 text-xs md:text-sm">
                        {review.product}
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-gray-800">{review.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => {
                              const starValue = i + 1;
                              const isHalfStar = review.rating >= starValue - 0.5 && review.rating < starValue;
                              const isFullStar = review.rating >= starValue;
                              
                              return (
                                <svg
                                  key={i}
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill={isFullStar ? "#FCD34D" : "none"}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="md:w-5 md:h-5"
                                >
                                  {isHalfStar ? (
                                    <defs>
                                      <linearGradient id={`half-${index}-${i}`}>
                                        <stop offset="50%" stopColor="#FCD34D" />
                                        <stop offset="50%" stopColor="#E5E7EB" />
                                      </linearGradient>
                                    </defs>
                                  ) : null}
                                  <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                    fill={isHalfStar ? `url(#half-${index}-${i})` : isFullStar ? "#FCD34D" : "#E5E7EB"}
                                  />
                                </svg>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6 text-gray-800 text-xs md:text-sm">
                        &quot;{review.comment}&quot;
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6 text-gray-800 text-xs md:text-sm">
                        {review.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}