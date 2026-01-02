"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    pricePerDay: "",
    location: "",
    condition: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Handle image upload logic here
    console.log(files);
  };

  const handleCancel = () => {
    // Reset form or navigate away
    setFormData({
      productName: "",
      description: "",
      pricePerDay: "",
      location: "",
      condition: "",
      category: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
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
          <span className="text-gray-900 font-medium">Add Product</span>
        </div>

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
            Add New Product
          </h1>
        </div>

        {/* Form Container */}
        <form id="add-product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Side - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-black mb-4">
                General Information
              </h2>

              <div className="space-y-4">
                {/* Product Name */}
                <div className="flex flex-col border-2 border-gray-200 rounded-xl px-4 md:px-6 py-2 md:py-3">
                  <label htmlFor="productName" className="text-sm text-gray-700 mb-1">
                    Product Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="Type your product name here"
                    className="outline-none text-sm md:text-base text-gray-900"
                    required
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col border-2 border-gray-200 rounded-xl px-4 md:px-6 py-2 md:py-3">
                  <label htmlFor="description" className="text-sm text-gray-700 mb-1">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Type your product description here"
                    rows="3"
                    className="outline-none resize-none text-sm md:text-base text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing, Details and Category Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Pricing and Details Container */}
              <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Price per Day */}
                  <div className="flex flex-col border-2 border-gray-200 rounded-xl px-4 md:px-6 py-2 md:py-3">
                    <label htmlFor="pricePerDay" className="text-sm text-gray-700 mb-1">
                      Price per Day <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="pricePerDay"
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      placeholder="₱0"
                      className="outline-none text-sm md:text-base text-gray-900"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col border-2 border-gray-200 rounded-xl px-4 md:px-6 py-2 md:py-3">
                    <label htmlFor="location" className="text-sm text-gray-700 mb-1">
                      Location <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Philippines"
                      className="outline-none text-sm md:text-base text-gray-900"
                      required
                    />
                  </div>

                  {/* Condition */}
                  <div className="flex flex-col border-2 border-gray-200 rounded-xl px-4 md:px-6 py-2 md:py-3 relative">
                    <label htmlFor="condition" className="text-sm text-gray-700 mb-1">
                      Condition <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="outline-none text-sm md:text-base appearance-none bg-white cursor-pointer text-gray-900 pr-8"
                      required
                    >
                      <option value="new">New</option>
                      <option value="like-new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  <div className="absolute right-4 md:right-6 bottom-3 md:bottom-4 pointer-events-none">
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.4" d="M12 18L24 30L36 18" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="lg:col-span-1 lg:py-4 md:lg:py-6">
                <div className="flex flex-col border-2 border-gray-200 rounded-xl px-4 md:px-6 py-2 md:py-3 relative">
                  <label htmlFor="category" className="text-sm text-gray-700 mb-1">
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="outline-none text-sm md:text-base appearance-none bg-white cursor-pointer text-gray-900 pr-8"
                    required
                  >
                    <option value="">Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="tools">Tools</option>
                    <option value="sports">Sports Equipment</option>
                    <option value="party">Party Supplies</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-4 md:right-6 bottom-3 md:bottom-4 pointer-events-none">
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.4" d="M12 18L24 30L36 18" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-black">
                  Product Images
                </h2>
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Edit Image
                </button>
              </div>

              {/* Main Image */}
              <div className="mb-4">
                <label
                  htmlFor="mainImage"
                  className="block w-full aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-500 transition-colors overflow-hidden"
                >
                  {mainImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={URL.createObjectURL(mainImage)}
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mb-2"
                      >
                        <path
                          d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-sm">Click to upload image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="mainImage"
                    accept="image/*"
                    onChange={(e) => setMainImage(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, index) => (
                  <label
                    key={index}
                    htmlFor={`thumbnail-${index}`}
                    className="aspect-square bg-gray-100 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-500 transition-colors overflow-hidden"
                  >
                    <div className="flex items-center justify-center h-full">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-400"
                      >
                        <path
                          d="M12 5V19M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="file"
                      id={`thumbnail-${index}`}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer px-6 py-2.5 md:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-product-form"
            className="cursor-pointer px-6 py-2.5 md:py-3 bg-zinc-300 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm md:text-base"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}