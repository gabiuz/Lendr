"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";

export default function ProductEdit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product_id');

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    pricePerDay: "",
    category: "",
    availability_status: "Available",
  });

  const [originalFormData, setOriginalFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [editing, setEditing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const ownerId = localStorage.getItem('owner_id');
        const res = await fetch(`/api/product-edit?product_id=${productId}&owner_id=${ownerId}`);
        const data = await res.json();
        if (data.success) {
          const product = data.product;
          const newFormData = {
            productName: product.product_name || "",
            description: product.description || "",
            pricePerDay: product.product_rate || "",
            category: product.category_code || "",
            availability_status: product.availability_status || "Available",
          };
          setFormData(newFormData);
          setOriginalFormData(newFormData);
          setImages(product.images || []);
          setImageUrls(product.images || []);
        } else {
          alert('Failed to load product');
          router.push('/browse-rentals');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        router.push('/browse-rentals');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      if (!productId) return;
      try {
        setLoadingReviews(true);
        const res = await fetch(`/api/product-reviews?product_id=${productId}`);
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchCategories();
    fetchProduct();
    fetchReviews();
  }, [productId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newImageUrls = [...imageUrls];
      newImageUrls[index] = reader.result;
      setImageUrls(newImageUrls);

      const newImages = [...images];
      newImages[index] = reader.result;
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId) return alert('Product ID is required');

    setSaving(true);
    try {
      const ownerId = localStorage.getItem('owner_id');
      if (!ownerId) return alert('Owner ID is required');

      const payload = {
        product_id: productId,
        owner_id: ownerId,
        product_name: formData.productName,
        description: formData.description,
        product_rate: parseFloat(formData.pricePerDay),
        category_code: formData.category,
        availability_status: formData.availability_status,
      };

      const res = await fetch('/api/product-edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert('Product updated successfully');
        setEditing(false);
        setOriginalFormData(formData);
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (editing) {
      setFormData(originalFormData);
      setEditing(false);
    } else {
      router.push('/browse-rentals');
    }
  };

  const handleDelete = async () => {
    if (!productId) return alert('Product ID is required');
    
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This will also delete all associated rentals, reviews, and payments. This action cannot be undone.'
    );
    
    if (!confirmed) return;

    setSaving(true);
    try {
      const ownerId = localStorage.getItem('owner_id');
      if (!ownerId) return alert('Owner ID is required');

      const res = await fetch('/api/product-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          owner_id: ownerId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Product and all associated records deleted successfully');
        router.push('/browse-rentals');
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error deleting product');
    } finally {
      setSaving(false);
    }
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar
        links={[
          { href: "/owner-homepage", label: "Home" },
          { href: "/browse-rentals", label: "Browse Rentals" },
          { href: "/owner-booking", label: "Bookings" },
          { href: "/owner-payments", label: "Payments" }
        ]}
        showOwnerButton={false}
        profileInCircle={true}
        personalProfileHref="/homepage"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8 lg:py-12 mt-24 md:mt-32 lg:mt-40">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Product Details</h1>
            <p className="text-gray-600">View and manage your product information</p>
          </div>
          <button
            onClick={() => {
              if (editing) {
                setFormData(originalFormData);
                setEditing(false);
              } else {
                setEditing(true);
              }
            }}
            className="flex justify-center items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <p className="text-black font-medium">{editing ? "Cancel" : "Edit"}</p>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  readOnly={!editing}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-black ${
                    editing
                      ? "border-gray-300 focus:ring-2 focus:ring-red-500"
                      : "border-transparent bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  readOnly={!editing}
                  rows="5"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none resize-none text-black ${
                    editing
                      ? "border-gray-300 focus:ring-2 focus:ring-red-500"
                      : "border-transparent bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-black ${
                      editing
                        ? "border-gray-300 focus:ring-2 focus:ring-red-500"
                        : "border-transparent bg-gray-50 cursor-not-allowed"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_code} value={cat.category_code}>
                        {cat.category_type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Per Day */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Day (₱)
                  </label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    readOnly={!editing}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-black ${
                      editing
                        ? "border-gray-300 focus:ring-2 focus:ring-red-500"
                        : "border-transparent bg-gray-50 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                <select
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-black ${
                    editing
                      ? "border-gray-300 focus:ring-2 focus:ring-red-500"
                      : "border-transparent bg-gray-50 cursor-not-allowed"
                  }`}
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black mb-6">Product Images</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index}>
                  <label className={`block w-full aspect-square border-2 border-dashed rounded-lg overflow-hidden ${
                    editing ? "cursor-pointer" : "cursor-not-allowed"
                  } ${
                    imageUrls[index] ? 'border-gray-300' : 'border-gray-300'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => editing && handleImageChange(index, e.target.files?.[0])}
                      disabled={!editing}
                      className="hidden"
                    />
                    {imageUrls[index] ? (
                      <img
                        src={imageUrls[index]}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        editing ? "bg-gray-50 hover:bg-gray-100" : "bg-gray-50"
                      }`}>
                        <div className="text-center">
                          {editing && (
                            <>
                              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <p className="text-xs text-gray-500">{index === 0 ? 'Main Image' : `Image ${index + 1}`}</p>
                            </>
                          )}
                          {!editing && (
                            <p className="text-xs text-gray-500">{index === 0 ? 'Main Image' : `Image ${index + 1}`}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black mb-6">Customer Reviews</h2>
            
            {loadingReviews ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600 text-center">No reviews yet. Be the first to rate this product!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.review_id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.first_name} {review.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      {renderStarRating(review.rating)}
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {!editing && (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/browse-rentals')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Back to Browse
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {saving ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
