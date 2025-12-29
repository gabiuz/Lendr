import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product = null, showButton = false }) {
  return (
    <>
      <div className="cursor-pointer hover:shadow-2xl transition-shadow rounded-xl outline outline-offset-1 outline-zinc-300 inline-flex flex-col justify-start items-start">
        <Image
          width={519}
          height={327}
          className="rounded-tl-xl rounded-tr-xl"
          src={product && product.image_url ? product.image_url : '/pictures/product_card_photo.png'}
          alt={product ? product.product_name : 'product card image'}
        />
        <div className="self-stretch px-5 py-4 flex flex-col justify-start items-start gap-6">
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
              {product ? product.category_code || 'Category' : 'Category'}
            </div>
          </div>
          <div className="justify-start text-black text-2xl font-semibold font-['Montserrat'] leading-6">
            {product ? product.product_name : 'Name of Product'}
          </div>
          <div className="self-stretch justify-start text-black text-sm font-normal font-['Montserrat'] leading-6">
            {product ? product.description : 'Description of Product - Placeholders'}
          </div>
          <div className="inline-flex justify-start items-center gap-3.5">
            <Image
              width={54}
              height={54}
              className="rounded-full"
              src={product && product.owner_avatar ? product.owner_avatar : '/pictures/sample-pfp-productCard.png'}
              alt="profile photo image"
            />
            <div className="w-52 inline-flex flex-col justify-start items-start">
              <div className="self-stretch justify-start text-black text-xl font-semibold font-['Montserrat'] leading-6">
                {product ? (product.business_name || 'Rental Owner Name') : 'Rental Owner Name'}
              </div>
              <div className="self-stretch justify-start text-zinc-800 text-base font-normal font-['Montserrat'] leading-6">
                {product ? (product.business_address || 'Rental Owner') : 'Rental Owner'}
              </div>
            </div>
          </div>
          {showButton && (
            <Link href={`/product-description?product_id=${product ? product.product_id : ''}`} className="w-full">
              <button className="w-full bg-red-600 hover:bg-red-700 rounded-xl px-6 py-2.5  text-white text-base font-semibold transition-colors duration-200">
                View Item
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
