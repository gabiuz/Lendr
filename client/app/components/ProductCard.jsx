"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductCard({ product = null, showButton = false }) {
  const router = useRouter();

  const handleProductClick = (e) => {
    if (showButton) {
      e.preventDefault();
      const customerId = localStorage.getItem("customer_id");
      const ownerId = localStorage.getItem("owner_id");
      
      if (!customerId && !ownerId) {
        router.push("/register");
      } else {
        router.push(`/product-description?product_id=${product ? product.product_id : ''}`);
      }
    }
  };

  return (
    <>
      <div className="cursor-pointer hover:shadow-2xl transition-shadow rounded-xl outline outline-offset-1 outline-zinc-300 flex flex-col justify-start items-start w-full h-full">
          <div className="w-full h-64 relative rounded-tl-xl rounded-tr-xl overflow-hidden bg-gray-200 flex items-center justify-center">
          <img
            className="w-full h-full object-cover"
            src={
              product
                ? (product.image_path || product.image_path1 || product.image_url || product.image || '/pictures/product_card_photo.png')
                : '/pictures/product_card_photo.png'
            }
            alt={product ? product.product_name : 'product card image'}
          />
        </div>
        <div className="self-stretch px-5 py-4 flex flex-col justify-start items-start gap-6 flex-1">
          <div className="w-full inline-flex justify-between items-center">
            <div className="justify-start">
              <span className="text-sky-800 text-xl font-semibold font-['Montserrat'] leading-6">
                ₱{product ? product.product_rate : '000'}
              </span>
              <span className="text-black text-base font-medium font-['Montserrat'] leading-6">
                /day
              </span>
            </div>
            <div className="justify-start text-zinc-800 text-sm font-normal font-['Montserrat'] leading-6">
              {product ? product.category_type || 'Category' : 'Category'}
            </div>
          </div>
          <div className="justify-start text-black text-2xl font-semibold font-['Montserrat'] leading-6 line-clamp-2">
            {product ? product.product_name : 'Name of Product'}
          </div>
          <div className="self-stretch justify-start text-black text-sm font-normal font-['Montserrat'] leading-6 line-clamp-2">
            {product ? product.description : 'Description of Product - Placeholders'}
          </div>
          <div className="inline-flex justify-start items-center gap-3.5 mt-auto">
            {product && product.owner_avatar && (
              <img
                width={54}
                height={54}
                className="rounded-full w-14 h-14 object-cover flex-shrink-0"
                src={product.owner_avatar}
                alt="profile photo image"
              />
            )}
            <div className="flex-1 inline-flex flex-col justify-start items-start min-w-0">
              <div className="self-stretch justify-start text-black text-xl font-semibold font-['Montserrat'] leading-6 truncate">
                {product ? (product.business_name || 'Rental Owner Name') : 'Rental Owner Name'}
              </div>
              <div className="self-stretch justify-start text-zinc-800 text-base font-normal font-['Montserrat'] leading-6 truncate">
                {product ? (product.business_address || 'Rental Owner') : 'Rental Owner'}
              </div>
            </div>
          </div>
          {showButton && (
            <button 
              onClick={handleProductClick}
              className="w-full bg-red-600 hover:bg-red-700 rounded-xl px-6 py-2.5 text-white text-base font-semibold transition-colors duration-200"
            >
              View Item
            </button>
          )}
        </div>
      </div>
    </>
  );
}

