"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

export default function ProductResult() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();

  const categories = [
    { id: "allItems", icon: "car", label: "All Items", code: "" },
    { id: "vehicles", icon: "car", label: "Vehicles", code: "100" },
    { id: "devices", icon: "computer", label: "Devices & Electronics", code: "101" },
    { id: "clothing", icon: "pin", label: "Clothing & Apparel", code: "102" },
    { id: "tools", icon: "tools", label: "Tools & Equipment", code: "103" },
    { id: "furniture", icon: "bed", label: "Furniture & Home", code: "104" },
    { id: "party", icon: "party", label: "Party & Events", code: "105" },
  ];

  useEffect(() => {
    // Allow unauthenticated users to view product results when they click a category.
    // Redirecting to register is handled when a product is clicked in `ProductCard`.
    // Set selected category based on URL parameter
    const categoryParam = searchParams.get('category');
    if (categoryParam === null) {
      // No category param -> treat as All Items by default
      setSelectedCategory(categories[0]);
    } else if (categoryParam === '') {
      // explicit empty category -> All Items
      setSelectedCategory(categories[0]);
    } else {
      const found = categories.find(cat => cat.code === categoryParam);
      if (found) setSelectedCategory(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const q = searchParams.get('q');
        const location = searchParams.get('location');
        const category = searchParams.get('category');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        if (q) params.set('q', q);
        if (location) params.set('location', location);
        // Include category param even if it's an empty string (represents All Items)
        if (category !== null) params.set('category', category);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          let results = data.products || [];
          // Exclude products that belong to the logged-in owner's business (if any)
          const ownerId = typeof window !== 'undefined' ? localStorage.getItem('owner_id') : null;
          if (ownerId) {
            results = results.filter(p => String(p.owner_id) !== String(ownerId));
          }
          // If category parameter is absent or present, show results but cap display to 15 maximum
          if (results.length > 15) {
            results = results.slice(0, 15);
          }
          setProducts(results);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [searchParams]);

  return (
    <div className="bg-white">
      <Navbar />
      <div
        className="sticky top-20 w-full bg-[url('/homepage-bg-image.jpg')] bg-cover bg-center pt-8 pb-8 z-40"
        id="productResult"
      >
        <div className="flex justify-center items-center px-4 py-4">
          <div className="flex bg-white px-4 py-4 lg:px-4 lg:py-4 lg:w-fit lg:gap-5 items-center rounded-2xl lg:mt-16">
            <Search formId="productSearchForm" />
          </div>
        </div>
      </div>
      {/* Categories filter section */}
      <div className="category-container bg-white py-8 md:py-12 lg:py-16 mt-6">
        <h2 className="flex text-black font-bold text-xl md:text-2xl lg:text-3xl pb-6 md:pb-8 justify-center px-4">
          Filter By Category
        </h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-5 categories-container px-4">
          {categories.map((category) => (
            <Categories
              key={category.id}
              icon={category.icon}
              label={category.label}
              isSelected={selectedCategory?.id === category.id}
              onSelect={() => {
                // toggle: if same category clicked, deselect and go back to homepage #categories
                if (selectedCategory?.id === category.id) {
                  setSelectedCategory(null);
                  router.push('/#categories');
                } else {
                  // select new category -> stay on product-result with category filter
                  setSelectedCategory(category);
                  const params = new URLSearchParams(searchParams);
                  // Always set category param (empty string for All Items)
                  params.set('category', category.code ?? '');
                  const qs = params.toString();
                  router.push(`/product-result${qs ? '?' + qs : ''}`);
                }
              }}
            />
          ))}
        </div>
      </div>
      <div className="Products mx-36">
        <div className="product-texts text-black flex flex-col gap-4 mt-10 mb-24">
          <h1 className="text-5xl font-bold">Products</h1>
          <p className="text-lg font-normal">Found {products.length} products</p>
        </div>
        <div className="productCard-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-[150px]">
          {loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No products found. Only products added by owners are displayed here.</p>
            </div>
          ) : (
            products.map((p) => <ProductCard key={p.product_id} product={p} showButton={true} />)
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
