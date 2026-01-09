"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

export default function RentedProduct() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [submittedRatings, setSubmittedRatings] = useState({});

  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("customer_id") : null;
    setCustomerId(id);
    
    if (id) {
      async function fetchRentals() {
        try {
          const res = await fetch(`/api/customer-rentals?customer_id=${id}`);
          const data = await res.json();
          if (data.success) {
            setRentals(data.rentals || []);
          } else {
            console.error("Error fetching rentals:", data.message);
          }
        } catch (error) {
          console.error("Failed to fetch rentals:", error);
        }
      }
      fetchRentals();
    }
  }, []);

  const handleStarClick = (rentalId, star) => {
    setRatings({ ...ratings, [rentalId]: star });
  };

  const handleReviewChange = (rentalId, value) => {
    setReviews({ ...reviews, [rentalId]: value });
  };

  const handleSubmitRating = async (rentalId) => {
    const rating = ratings[rentalId];
    const review = reviews[rentalId];

    if (!rating) {
      alert("Please select a star rating before submitting.");
      return;
    }

    const rental = rentals.find(r => r.rental_id === rentalId);
    if (!rental || !customerId) {
      alert("Unable to submit review. Missing rental or customer information.");
      return;
    }

    try {
      const res = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerId,
          productId: rental.product_id,
          rating: rating,
          comment: review || null
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setSubmittedRatings({ ...submittedRatings, [rentalId]: true });
        alert("Thank you for your review! Your rating has been submitted.");
      } else {
        alert("Error submitting review: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      "to ship": "bg-orange-100 text-orange-800 border-orange-300",
      "shipped": "bg-blue-100 text-blue-800 border-blue-300",
      "completed": "bg-green-100 text-green-800 border-green-300",
      "pending": "bg-yellow-100 text-yellow-800 border-yellow-300",
    };

    const lowerStatus = status?.toLowerCase() || "pending";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          statusColors[lowerStatus] || "bg-gray-100 text-gray-800 border-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  if (!customerId) {
    return (
      <div className="bg-white min-h-screen w-full">
        <Navbar />
        <div className="w-full px-4 lg:px-36 pt-12 lg:pt-36">
          <div className="border rounded-lg p-8 bg-white shadow-sm text-center max-w-md mx-auto">
            <h2 className="text-2xl text-black font-semibold mb-4">
              Please Log In
            </h2>
            <p className="mb-6 text-gray-600">
              You need to be logged in to view your rented products.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-3 border-2 border-light-gray rounded-lg cursor-pointer hover:text-red hover:border-red font-semibold"
              >
                Log in
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-6 py-3 bg-light-gray text-white rounded-lg cursor-pointer hover:bg-red font-semibold"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen w-full">
      <Navbar />
      
      {/* Page Header */}
      <div className="text-black px-4 py-8 lg:px-36 lg:pt-36">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-4">
          <Link href="/homepage" className="text-sm hover:text-red transition-colors">
            Home
          </Link>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.25854 4.44824C6.32559 4.44826 6.37656 4.46878 6.42847 4.52051L9.72534 7.81738C9.76116 7.85329 9.77811 7.8817 9.78589 7.90039C9.79571 7.92407 9.80151 7.95098 9.80151 7.9834C9.80147 8.0158 9.79576 8.04273 9.78589 8.06641C9.77807 8.08516 9.76134 8.1134 9.72534 8.14941L6.41187 11.4619C6.36016 11.5135 6.3161 11.5283 6.26245 11.5264C6.19961 11.5241 6.14502 11.5027 6.08765 11.4453C6.03566 11.3933 6.01538 11.3416 6.01538 11.2744C6.01545 11.2074 6.03586 11.1564 6.08765 11.1045L9.20874 7.9834L8.97339 7.74707L6.07104 4.84473C6.01953 4.79306 6.00562 4.74895 6.00757 4.69531C6.00987 4.63247 6.03028 4.57788 6.08765 4.52051C6.13972 4.46845 6.19129 4.44824 6.25854 4.44824Z"
              fill="black"
              stroke="black"
              strokeWidth="0.666667"
            />
          </svg>
          <p className="text-sm font-semibold">My Rented Products</p>
        </div>

        <h1 className="text-3xl font-semibold lg:text-4xl">
          My Rented Products
        </h1>
        <p className="text-zinc-600 mt-2">
          View and manage your rental history
        </p>
      </div>

      {/* Rentals Grid */}
      <div className="px-4 lg:px-36 pb-12">
        {rentals.length === 0 ? (
          <div className="border rounded-lg p-12 bg-white shadow-sm text-center">
            <svg
              className="mx-auto mb-4 text-gray-400"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <h2 className="text-xl text-black font-semibold mb-2">
              No Rentals Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't rented any products yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {rentals.map((rental) => (
              <motion.div
                key={rental.rental_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-zinc-300 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Product Image & Details */}
                  <div className="lg:col-span-2">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={rental.image_path}
                          alt={rental.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h2 className="text-2xl font-semibold text-black">
                              {rental.product_name}
                            </h2>
                            <p className="text-zinc-600 text-sm mt-1">
                              {rental.category_type}
                            </p>
                          </div>
                          {getStatusBadge(rental.status)}
                        </div>

                        {/* Rental Period */}
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-zinc-600">Start Date</p>
                              <p className="font-semibold text-black">
                                {new Date(rental.rental_start).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-zinc-600">End Date</p>
                              <p className="font-semibold text-black">
                                {new Date(rental.rental_end).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-zinc-600 text-sm">
                              Rate: <span className="text-sky-800 font-semibold">₱{rental.product_rate}</span>/day
                            </p>
                            <p className="text-black font-bold text-lg mt-1">
                              Total: ₱{rental.total_cost.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Owner Info */}
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                          <img
                            src={rental.business_profile_picture || "/pictures/sample-pfp-productCard.png"}
                            alt={rental.business_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-black">
                              {rental.business_name}
                            </p>
                            <p className="text-zinc-600 text-sm">
                              {rental.business_address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Section - Only for Completed Rentals */}
                  {rental.status && rental.status.toLowerCase() === "completed" && (
                    <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-6">
                      {submittedRatings[rental.rental_id] ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <svg
                              className="w-8 h-8 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <p className="font-semibold text-black">
                            Review Submitted!
                          </p>
                          <p className="text-sm text-zinc-600 mt-1">
                            Thank you for your feedback
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <h3 className="text-lg font-semibold text-black">
                            Rate this Product
                          </h3>

                          {/* Star Rating */}
                          <div className="flex flex-col gap-2">
                            <label className="text-sm text-zinc-600">
                              Your Rating
                            </label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() =>
                                    handleStarClick(rental.rental_id, star)
                                  }
                                  className="focus:outline-none transition-transform hover:scale-110"
                                >
                                  <svg
                                    className="w-8 h-8"
                                    fill={
                                      ratings[rental.rental_id] >= star
                                        ? "#FCD34D"
                                        : "#E5E7EB"
                                    }
                                    stroke={
                                      ratings[rental.rental_id] >= star
                                        ? "#F59E0B"
                                        : "#D1D5DB"
                                    }
                                    strokeWidth="1"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                            {ratings[rental.rental_id] && (
                              <p className="text-sm text-zinc-600">
                                {ratings[rental.rental_id]} out of 5 stars
                              </p>
                            )}
                          </div>

                          {/* Review Text */}
                          <div className="flex flex-col gap-2">
                            <label className="text-sm text-zinc-600">
                              Your Review (Optional)
                            </label>
                            <textarea
                              value={reviews[rental.rental_id] || ""}
                              onChange={(e) =>
                                handleReviewChange(
                                  rental.rental_id,
                                  e.target.value
                                )
                              }
                              placeholder="Share your experience with this product..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red focus:border-transparent text-black resize-none"
                              rows="4"
                            />
                          </div>

                          {/* Submit Button */}
                          <button
                            onClick={() => handleSubmitRating(rental.rental_id)}
                            className="w-full bg-red hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                          >
                            Submit Review
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
