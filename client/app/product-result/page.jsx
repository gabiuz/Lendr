"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

export default function ProductResult() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const q = searchParams.get('q');
        const location = searchParams.get('location');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        if (q) params.set('q', q);
        if (location) params.set('location', location);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        if (data.success) setProducts(data.products || []);
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
        className="w-full h-96 bg-[url('/homepage-bg-image.jpg')] bg-cover bg-center"
        id="productResult"
      >
        <div className="flex justify-center items-center px-4 py-4">
          <div className="flex bg-white lg:px-4 lg:py-4 lg:w-fit lg:gap-5 items-center rounded-2xl lg:mt-16">
            <Search formId="productSearchForm" />
            <button
              onClick={() => {
                const f = document.getElementById('productSearchForm');
                if (f && typeof f.requestSubmit === 'function') f.requestSubmit();
                else if (f) f.dispatchEvent(new Event('submit', { cancelable: true }));
              }}
              className="cursor-pointer ml-2"
              aria-label="Search"
            >
              <svg
                width="66"
                height="66"
                viewBox="0 0 66 66"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="66" height="66" rx="33" fill="#FF0000" />
                <path
                  d="M40.3594 30.1092C40.3594 23.9357 35.3605 18.9354 29.1886 18.9354C23.0168 18.9354 18.0179 23.9357 18.0179 30.1092C18.0179 36.2827 23.0168 41.283 29.1886 41.283C35.3605 41.283 40.3594 36.2827 40.3594 30.1092ZM38.2021 41.4995C35.7305 43.4619 32.5957 44.6351 29.1886 44.6351C21.1666 44.6351 14.6666 38.1334 14.6666 30.1092C14.6666 22.0851 21.1666 15.5833 29.1886 15.5833C37.2107 15.5833 43.7107 22.0851 43.7107 30.1092C43.7107 33.5172 42.5377 36.6529 40.5759 39.1251L49.9244 48.4761C49.9244 48.4761 50.5807 49.1326 50.5807 50.1941C50.5807 51.2556 49.9244 51.4931 49.2681 51.4931C48.6118 51.4931 48.2069 51.5 47.5576 50.8436L38.2021 41.4995Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
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
          ) : (
            products.map((p) => <ProductCard key={p.product_id} product={p} showButton={true} />)
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
