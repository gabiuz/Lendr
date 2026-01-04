"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Booking from "../components/Booking";
import Review from "../components/Review";
import { useSearchParams } from 'next/navigation';

export default function ProductDescription() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product_id');
  const [isTermsOpen, setIsTermsOpen] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('/pictures/product-img-placeholder/Row.png');
  const [product, setProduct] = useState(null);
  const thumbnailImages = (product && product.images && product.images.length)
    ? product.images
    : [
        '/pictures/product-img-placeholder/Row.png',
        '/pictures/product-img-placeholder/Row-1.png',
        '/pictures/product-img-placeholder/Row-2.png',
      ];

  useEffect(() => {
    async function load() {
      if (!productId) return;
      try {
        const res = await fetch(`/api/product?product_id=${productId}`);
        const data = await res.json();
        if (data.success) setProduct(data.product);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [productId]);
  
    return (
      <>
        <Navbar />
        <div className="product-desc-container text-black pt-20 md:pt-24 mb-8 md:mb-12 lg:mb-16 mx-4 md:mx-8 lg:mx-20 xl:mx-36 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-6 lg:mt-24">
        <div className="flex flex-col gap-6">
          <div className="breadcrumbs flex items-center gap-2 ">
            <Link href="/homepage" className="text-sm">
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
              <Link
                href={`/product-result${searchParams.get('category') !== null ? '?category=' + encodeURIComponent(searchParams.get('category')) : ''}`}
                className="text-sm"
              >
                Products
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
            <p className="text-sm font-semibold">{product ? product.product_name : 'Product'}</p>
          </div>
          <div className="title">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{product ? product.product_name : 'Product'}</h1>
          </div>
          <div className="price">
            <h2 className="text-base font-bold">
              <span className="text-sky-800">₱{product ? product.product_rate : ''}</span>/day
            </h2>
          </div>
          <div className="product-description font-medium text-base">
            <p>{product ? product.description : 'Product details will appear here.'}</p>
          </div>
          <div className="owner-container flex items-center gap-3.5">
            <Image
              src={product && product.owner_avatar ? product.owner_avatar : '/pictures/sample-pfp-productCard.png'}
              alt="Owner-profile-picture"
              width={54}
              height={54}
              className="rounded-full w-14 h-14"
            />
            <div>
              <p className="font-bold">{product ? (product.business_name || 'Rental Owner Name') : 'Rental Owner Name'}</p>
              <p className="text-zinc-800 text-base font-normal font-['Montserrat'] leading-6">
                {product ? (product.business_address || 'Rental Owner') : 'Rental Owner'}
              </p>
            </div>
          </div>
          <div className="buttons-container flex flex-col gap-3 md:gap-4">
            <button onClick={() => setIsBookingOpen(true)} className="bg-red-600 hover:bg-red-700 hover:shadow-md rounded-xl px-6 py-2.5  text-white text-base font-semibold transition-colors duration-200 w-full cursor-pointer">
              Book Now
            </button>
            <button className="bg-white border-2 hover:shadow-md border-light-gray hover:border-red hover:text-black hover:bg-[#FF000040] rounded-xl px-6 py-2.5 text-light-gray text-base font-semibold transition-colors duration-200 w-full cursor-pointer">
              Message Owner
            </button>
          </div>
          <div className="terms-container border-t-3 border-t-red-900 flex flex-col">
            <div
              className="terms-container-text flex items-center justify-between w-full cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2"
              onClick={() => setIsTermsOpen(!isTermsOpen)}
            >
              <h2 className="text-lg md:text-xl font-semibold py-3 md:py-4">Terms & Conditions</h2>
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-300 ${
                  isTermsOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <path
                  opacity="0.4"
                  d="M8.12109 14.85L13.4747 9.49638C13.4916 9.48373 13.5084 9.47107 13.5211 9.46685C15.3267 11.2598 17.1239 13.0528 18.9211 14.85H8.12109Z"
                  fill="#990000"
                />
                <path
                  d="M12.5677 8.49657C13.1119 8.00719 13.9345 7.95657 14.4745 8.49657L19.8745 13.8966C20.2627 14.2847 20.3766 14.8627 20.1656 15.3689L20.0728 15.5503C19.8324 15.9511 19.3936 16.2042 18.9169 16.2042H8.11688L7.91438 16.1916C7.51782 16.1325 7.16766 15.8963 6.96095 15.5545L6.86813 15.3731C6.69095 14.9259 6.75845 14.4281 7.03266 14.0484L7.16345 13.8923L12.5634 8.49235L12.5677 8.49657ZM13.5253 9.46688C13.5127 9.4711 13.4958 9.47954 13.4789 9.49641L8.1211 14.85H18.9211L13.5338 9.46266C13.5295 9.46266 13.5253 9.46688 13.5253 9.46688Z"
                  fill="#990000"
                />
              </svg>
            </div>
            <AnimatePresence>
              {isTermsOpen && (
                <motion.div
                  className="terms-container-lists overflow-hidden flex flex-col gap-2"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <p className="text-base font-bold py-2">Eligibility</p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>Renter must be 18 years old or above.</li>
                    <li>Must submit 2 valid IDs (1 government issued).</li>
                    <li>Must provide a selfie holding the IDs.</li>
                    <li>
                      Must submit 2 recent proof of billing documents (matching
                      the ID name).
                    </li>
                    <li>
                      Renter must have public social media accounts for
                      verification.
                    </li>
                  </ul>
                  <p className="text-base font-bold py-2">Payment & Deposit</p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>
                      A 50% non-refundable downpayment is required to reserve
                      the item.
                    </li>
                    <li>₱475 security deposit is required before release.</li>
                    <li>Remaining balance must be paid before dispatch.</li>
                    <li>
                      Security deposit is refunded within 24 hours after
                      inspection of the returned unit.
                    </li>
                  </ul>
                  <p className="text-base font-bold py-2">Cancellation</p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>Downpayment is strictly non-refundable.</li>
                    <li>
                      Rescheduling may be allowed depending on availability.
                    </li>
                  </ul>
                  <p className="text-base font-bold py-2">Returns</p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>
                      Items must be returned in the same condition as released.
                    </li>
                    <li>
                      A ₱200/hour late fee will be deducted from the security
                      deposit.
                    </li>
                    <li>
                      Additional charges apply if the deposit is insufficient.
                    </li>
                    <li>
                      A ₱500/day fee applies if the delay affects the next
                      renter.
                    </li>
                  </ul>
                  <p className="text-base font-bold py-2">Damage / Loss</p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>
                      Renter is responsible for repair or replacement costs.
                    </li>
                    <li>
                      Full replacement cost may be charged for total loss or
                      theft.
                    </li>
                  </ul>
                  <p className="text-base font-bold py-2">Delivery</p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>
                      Delivery is via Lalamove / Angkas / Grab Express Premium.
                    </li>
                    <li>Shipping fees are shouldered by the renter.</li>
                    <li>
                      A photo of the rider and plate number must be submitted
                      for monitoring.
                    </li>
                  </ul>
                  <p className="text-base font-bold py-2">Transparency</p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>
                      Renter is encouraged to send photos/videos upon receiving
                      and before returning the item.
                    </li>
                  </ul>
                  <p className="text-base font-bold py-2">
                    International Travel
                  </p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>Requires itinerary + proof of billing.</li>
                  </ul>
                  <p className="text-base font-bold py-2">Conduct</p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>
                      Rude or abusive behavior may result in service refusal and
                      future blocking.
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="how-to-book-container border-t-3 border-t-red-900 flex flex-col">
            <div
              className="how-to-book-container-text flex items-center justify-between w-full cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2"
              onClick={() => setIsBookOpen(!isBookOpen)}
            >
              <h2 className="text-lg md:text-xl font-semibold py-3 md:py-4">How to Book</h2>
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-300 ${
                  isBookOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <path
                  opacity="0.4"
                  d="M8.12109 14.85L13.4747 9.49638C13.4916 9.48373 13.5084 9.47107 13.5211 9.46685C15.3267 11.2598 17.1239 13.0528 18.9211 14.85H8.12109Z"
                  fill="#990000"
                />
                <path
                  d="M12.5677 8.49657C13.1119 8.00719 13.9345 7.95657 14.4745 8.49657L19.8745 13.8966C20.2627 14.2847 20.3766 14.8627 20.1656 15.3689L20.0728 15.5503C19.8324 15.9511 19.3936 16.2042 18.9169 16.2042H8.11688L7.91438 16.1916C7.51782 16.1325 7.16766 15.8963 6.96095 15.5545L6.86813 15.3731C6.69095 14.9259 6.75845 14.4281 7.03266 14.0484L7.16345 13.8923L12.5634 8.49235L12.5677 8.49657ZM13.5253 9.46688C13.5127 9.4711 13.4958 9.47954 13.4789 9.49641L8.1211 14.85H18.9211L13.5338 9.46266C13.5295 9.46266 13.5253 9.46688 13.5253 9.46688Z"
                  fill="#990000"
                />
              </svg>
            </div>
            <AnimatePresence>
              {isBookOpen && (
                <motion.div
                  className="how-to-book-container-lists overflow-hidden flex flex-col gap-2"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <p><strong>Step 1:</strong> Read and understand the Terms & Conditions before booking.</p>
                  <p><strong>Step 2:</strong> Choose your rental dates in the calendar.</p>
                  <p><strong>Step 3:</strong> Wait for confirmation of availability from the owner.</p>
                  <p><strong>Step 4:</strong> Once approved, the renter will message you to submit the required documents.</p>
                  <p><strong>Step 5:</strong> After requirements are verified, secure your reservation by paying the 50% non-refundable downpayment</p>  
                  <br />
                  <p className="text-base font-bold py-2">Requirements:</p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>
                      Public social media account for verification
                    </li>
                    <li>
                      2 valid IDs (at least 1 government-issued)
                    </li>
                    <li>
                      Selfie holding the 2 IDs
                    </li>
                    <li>
                      2 recent proof of billing documents (matching the ID address)
                    </li>
                    <li>
                      For travel shoots: flight details + proof of billing (domestic or international)
                    </li>
                  </ul>
                  <br />
                  <p className="text-base font-bold py-2">Mode of Payment:</p>
                  <ul className="list-disc flex flex-col justify-center pl-5">
                    <li>
                      BPI
                    </li>
                    <li>
                      Seabank
                    </li>
                    <li>
                      GCash
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="faq-container border-t-3 border-t-red-900 flex flex-col">
            <div
              className="faq-container-text flex items-center justify-between w-full cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2"
              onClick={() => setIsFAQOpen(!isFAQOpen)}
            >
              <h2 className="text-lg md:text-xl font-semibold py-3 md:py-4">FAQ</h2>
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-300 ${
                  isFAQOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <path
                  opacity="0.4"
                  d="M8.12109 14.85L13.4747 9.49638C13.4916 9.48373 13.5084 9.47107 13.5211 9.46685C15.3267 11.2598 17.1239 13.0528 18.9211 14.85H8.12109Z"
                  fill="#990000"
                />
                <path
                  d="M12.5677 8.49657C13.1119 8.00719 13.9345 7.95657 14.4745 8.49657L19.8745 13.8966C20.2627 14.2847 20.3766 14.8627 20.1656 15.3689L20.0728 15.5503C19.8324 15.9511 19.3936 16.2042 18.9169 16.2042H8.11688L7.91438 16.1916C7.51782 16.1325 7.16766 15.8963 6.96095 15.5545L6.86813 15.3731C6.69095 14.9259 6.75845 14.4281 7.03266 14.0484L7.16345 13.8923L12.5634 8.49235L12.5677 8.49657ZM13.5253 9.46688C13.5127 9.4711 13.4958 9.47954 13.4789 9.49641L8.1211 14.85H18.9211L13.5338 9.46266C13.5295 9.46266 13.5253 9.46688 13.5253 9.46688Z"
                  fill="#990000"
                />
              </svg>
            </div>
            <AnimatePresence>
              {isFAQOpen && (
                <motion.div
                  className="faq-container-lists overflow-hidden flex flex-col gap-4"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <div className="faq-item">
                    <p className="text-base font-bold">1. What comes with the Canon EOS 90D when I rent it?</p>
                    <p className="mt-1">Each rental includes the camera body, battery, charger, neck strap, and basic documentation. Everything is cleaned and tested before release.</p>
                  </div>
                  
                  <div className="faq-item">
                    <p className="text-base font-bold">2. Can beginners use this camera?</p>
                    <p className="mt-1">Yes! The Canon EOS 90D is beginner-friendly and great for events, portraits, vlogging, and travel. You may search online for tutorials if you need guidance.</p>
                  </div>
                  
                  <div className="faq-item">
                    <p className="text-base font-bold">3. Can I extend my rental?</p>
                    <p className="mt-1">Yes, as long as the camera isn&apos;t booked by another renter. Just send us a message before your return time so we can confirm availability.</p>
                  </div>
                  
                  <div className="faq-item">
                    <p className="text-base font-bold">4. Do you offer discounts for long-term rentals?</p>
                    <p className="mt-1">Yes, we sometimes provide discounted rates for multi-day or extended rentals. Message us for the updated long-term pricing.</p>
                  </div>
                  
                  <div className="faq-item">
                    <p className="text-base font-bold">5. Do you provide lenses or accessories?</p>
                    <p className="mt-1">Currently, our rental package includes only the camera body and default items listed. Additional lenses or accessories may be added in the future.</p>
                  </div>
                  
                  <div className="faq-item">
                    <p className="text-base font-bold">6. Can I see the camera before booking?</p>
                    <p className="mt-1">Yes. If you prefer, we can arrange a brief video call or send updated photos of the unit so you can inspect its condition before confirming.</p>
                  </div>
                  
                  <div className="faq-item">
                    <p className="text-base font-bold">7. How early should I book?</p>
                    <p className="mt-1">We recommend booking at least 1–3 days ahead, especially for weekends or event seasons, as the camera can be fully booked.</p>
                  </div>
                  
                  <div className="faq-item">
                    <p className="text-base font-bold">8. Do you allow refunds if my shoot is canceled?</p>
                    <p className="mt-1">While the downpayment itself is non-refundable, you may request a date change if your new schedule is still available.</p>
                  </div>
                  
                  <div className="faq-item">
                    <p className="text-base font-bold">9. How will I know if the dates I want are available?</p>
                    <p className="mt-1">Your selected dates will be reviewed, and we&apos;ll notify you through the app or message once your booking is confirmed.</p>
                  </div>
                  
                  <div className="faq-item">
                    <p className="text-base font-bold">10. What should I do if the item I receive seems different from the listing?</p>
                    <p className="mt-1">Message us immediately. The camera is checked thoroughly before dispatch, but we encourage renters to report anything unusual upon arrival.</p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-base font-bold mb-2">Please Note:</p>
                    <ul className="list-disc flex flex-col gap-2 pl-5">
                      <li>Incomplete requirements may result in booking denial.</li>
                      <li>No downpayment = no confirmed reservation.</li>
                      <li>Ensure your dates are final; cancellations are not allowed once booked.</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="image-gallery-container flex flex-col gap-4">
            <div className="main-image-container rounded-xl overflow-hidden">
              <Image
                width={791}
                height={677}
                alt="product image"
                src={selectedImage}
                className="w-full object-cover transition-opacity duration-300"
              />
            </div>
            <div className="thumbnail-container grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
              {thumbnailImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`thumbnail-item rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                    selectedImage === image
                      ? "border-red-900 shadow-lg scale-105"
                      : "border-gray-300 hover:border-red-500 hover:shadow-md"
                  }`}
                >
                  <Image
                    width={150}
                    height={128}
                    alt={`thumbnail ${index + 1}`}
                    src={image}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="reviews-container w-fit">
              <Review />
            </div>
          </div>
        </div>
          <Booking isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        </div>
        <Footer />
      </>
  );
}
