"use client";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

const ProductCard = ({ product }) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow w-full h-full">
    <div className="bg-gray-200 h-48 flex items-center justify-center">
      {product.image ? (
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      ) : (
        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )}
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-lg text-black">{product.name}</h3>
        <Link href={`/product-edit?product_id=${product.id}`} className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </Link>
      </div>
      <p className="text-sm text-gray-600 mb-2">{product.location}</p>
      <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-black">{product.price}</span>
          <span className="text-sm text-gray-500">{product.priceUnit}</span>
        </div>
        <button className="text-red-600 font-medium text-sm hover:text-red-700">
          {product.status}
        </button>
      </div>
    </div>
  </div>
);

const AddProductCard = () => (
  <Link href="/add-products">
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-full min-h-[400px] flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
    </div>
  </Link>
);

export default function BrowseRentals() {
  const [categoriesProducts, setCategoriesProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Get owner_id from localStorage
        const ownerId = typeof window !== 'undefined' ? localStorage.getItem('owner_id') : null;
        if (!ownerId) {
          console.error('No owner_id found in localStorage');
          return;
        }

        // Fetch only this owner's products
        const res = await fetch(`/api/products?owner_id=${ownerId}`);
        const data = await res.json();
        if (data.success) {
          const products = data.products.map((p) => ({
            id: p.product_id,
            name: p.product_name,
            location: p.business_address || '',
            description: p.description || '',
            price: `₱${p.product_rate}`,
            priceUnit: '/day',
            status: p.availability_status || 'Available',
            image: p.image_path || null,
            category: p.category_type || 'Uncategorized'
          }));

          const map = new Map();
          for (const prod of products) {
            const key = prod.category || 'Uncategorized';
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(prod);
          }
          const groups = Array.from(map.entries()).map(([name, products]) => ({ name, products }));
          setCategoriesProducts(groups);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        links={[
          { href: "/owner-homepage", label: "Home" },
          { href: "/browse-rentals", label: "Browse Rentals" },
          { href: "/owner-booking", label: "Bookings" },
          { href: "/owner-payments", label: "Payments" },
        ]}
        showOwnerButton={false}
        profileInCircle={true}
        personalProfileHref="/homepage"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pt-24 md:pt-32 lg:pt-40">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>›</span>
          <span className="text-black">My Rentals</span>
        </div>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">My Rentals</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your rentals, all in one place</p>
        </div>

        {/* Search and Add Product */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search Rentals"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button 
              type="button" 
              onClick={() => setActiveSearchQuery(searchQuery)}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-1.5 md:p-2 rounded transition-colors"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <Link
            href="/add-products"
            className="bg-black text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
            style={{ color: '#fff' }}
          >
            <span className="text-white">Add Product</span>
          </Link>
        </div>

        {/* Category Sections (dynamic) */}
        {categoriesProducts.map((group) => {
          const filteredProducts = group.products.filter(product =>
            product.name.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(activeSearchQuery.toLowerCase())
          );
          
          // Only show categories with matching products when searching
          if (activeSearchQuery && filteredProducts.length === 0) return null;
          
          return (
            <div key={group.name} className="mb-8 md:mb-10 lg:mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">{group.name}</h2>
              <div className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="shrink-0 w-64 md:w-72 lg:w-80">
                    <ProductCard product={product} />
                  </div>
                ))}
                <div className="shrink-0 w-64 md:w-72 lg:w-80">
                  <AddProductCard />
                </div>
              </div>
            </div>
          );
        })}

        {/* No products found message */}
        {activeSearchQuery && categoriesProducts.every(group =>
          group.products.filter(product =>
            product.name.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(activeSearchQuery.toLowerCase())
          ).length === 0
        ) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}





