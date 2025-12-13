"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import InfoCard from "../components/Infocard";
import TestimonialCard, { quoteIcon } from "../components/TestimonialCard";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Homepage() {
  const categories = [
    { id: "allItems", icon: "car", label: "All Items" },
    { id: "vehicles", icon: "car", label: "Vehicles" },
    { id: "devices", icon: "computer", label: "Devices & Electronics" },
    { id: "clothing", icon: "pin", label: "Clothing & Apparel" },
    { id: "tools", icon: "tools", label: "Tools & Equipment" },
    { id: "furniture", icon: "bed", label: "Furniture & Home" },
    { id: "party", icon: "party", label: "Party & Events" },
  ];

  const testimonials = [
    {
      name: "Maria Reyes",
      renter: "Camera Renter",
      description: (
        <p>
          I needed a professional-grade prime camera lens for a one-day photo
          shoot, but buying one was completely out of the question. Your app
          made finding a local photographer{" "}
          <span className="text-red-800">willing to rent</span> theirs
          incredibly easy.
        </p>
      ),
      image: "/pictures/testimonials-pfp/Image.png",
    },
    {
      name: "Maria Reyes",
      renter: "Pressure Washer Renter",
      description: (
        <p>
          Finally got around to tackling that huge DIY project: cleaning my
          driveway and deck. The industrial pressure washer I rented through the
          app was a beast and made the work fly by! I found a neighbor listing
          theirs just three blocks away. The chat feature made coordinating the
          drop-off and pickup super smooth, and{" "}
          <span className="text-red-800">
            the rental cost was far cheaper than going to a big box store.
          </span>{" "}
        </p>
      ),
      image: "/pictures/testimonials-pfp/Image1.png",
    },
    {
      name: "Lian Batumbakal",
      renter: "Tent Renter",
      description: (
        <p>
          Organizing my daughter&apos;s graduation party was stressful, but
          checking one major item off the list was a breeze. We rented a huge,
          beautiful event canopy tent that was perfect for the backyard. The
          owner was super helpful, giving us tips for setup and even throwing in
          some extra lighting.
        </p>
      ),
      image: "/pictures/testimonials-pfp/Image3.png",
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const variants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar />

      <header
        className="h-[600px] xl:h-[750px] bg-[url('/homepage-bg-image.jpg')] bg-opacity bg-cover bg-center"
        id="home"
      >
        <div className="flex flex-col items-center gap-6 pt-40 text-center px-4">
          <h1 className="text-white font-bold text-4xl xl:text-6xl">
            Rent Anything, <span className="text-red"> Anytime</span>
          </h1>
          <p className="text-white font-medium text-base xl:text-xl max-w-2xl">
            Search thousands of listings across categories. Compare prices,
            check availability, and rent securely — all in one place.
          </p>
        </div>
        <div className="flex justify-center items-center px-4 py-4">
          <div className="flex bg-white lg:px-4 lg:py-4 lg:w-fit lg:gap-5 items-center rounded-2xl lg:mt-16">
            <Search />
            <button className="cursor-pointer">
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
      </header>
      {/* category container */}
      <div className="category-container bg-white mb-20" id="categories">
        <h2 className="flex text-black font-bold lg:text-4xl lg:pt-28 lg:pb-12 lg:justify-center">
          Browse By Category
        </h2>
        <div className="flex justify-center gap-6 categories-container ">
          {categories.map((category) => (
            <Categories
              key={category.id}
              icon={category.icon}
              label={category.label}
            ></Categories>
          ))}
        </div>
      </div>
      {/* product card */}
      <div
        className="productCard-container mx-36 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-[150px]"
        id="browse"
      >
        <ProductCard></ProductCard>
        <ProductCard></ProductCard>
        <ProductCard></ProductCard>
        <ProductCard></ProductCard>
        <ProductCard></ProductCard>
        <ProductCard></ProductCard>
      </div>
      <div className="info-card-container flex bg-zinc-800 justify-center items-center gap-36 px-36 py-14">
        <div className="text">
          <h2 className="lg:text-2xl font-semibold">Renting Made Simple</h2>
          <h1 className="lg:text-6xl font-bold">How Lendr Works?</h1>
        </div>
        <div className="flex info-cards bg-zinc gap-14" id="aboutUs">
          <InfoCard icon="search" text="searchText" />
          <InfoCard icon="calendar" text="calendarText" />
          <InfoCard icon="deliver" text="deliverText" />
        </div>
      </div>
      <div className="testimonial-container flex flex-col justify-center mt-24">
        <div className="testimonial-texts flex flex-col gap-4 text-center text-black">
          <h3 className="font-bold text-2xl">Testimonial</h3>
          <h2 className="font-bold text-5xl">What our customers say?</h2>
        </div>
        <div className="testimonialCard-container flex justify-center items-center mx-[280px] gap-36">
          <button className="cursor-pointer" onClick={prevTestimonial}>
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M43.4 14.0001V42.0001C43.4 42.7701 42.77 43.4001 42 43.4001H14C13.23 43.4001 12.6 42.7701 12.6 42.0001V14.0001C12.6 13.2301 13.23 12.6001 14 12.6001H42C42.77 12.6001 43.4 13.2301 43.4 14.0001ZM37.1 28.0001C37.1 26.8363 36.1637 25.9001 35 25.9001H26.0662L28.7787 23.1876C29.6012 22.3651 29.6012 21.0351 28.7787 20.2213C27.9562 19.4076 26.6262 19.3988 25.8125 20.2213L19.5125 26.5213C18.69 27.3438 18.69 28.6738 19.5125 29.4876L25.8125 35.7876C26.635 36.6101 27.965 36.6101 28.7787 35.7876C29.5925 34.9651 29.6012 33.6351 28.7787 32.8213L26.0662 30.1088H35C36.1637 30.1088 37.1 29.1726 37.1 28.0088V28.0001Z"
                fill="#990000"
              />
              <path
                d="M42 12.5999C42.77 12.5999 43.4 13.2299 43.4 13.9999V41.9999C43.4 42.7699 42.77 43.3999 42 43.3999H14C13.23 43.3999 12.6 42.7699 12.6 41.9999V13.9999C12.6 13.2299 13.23 12.5999 14 12.5999H42ZM47.6 13.9999C47.6 10.9112 45.0888 8.3999 42 8.3999H14C10.9113 8.3999 8.40001 10.9112 8.40001 13.9999V41.9999C8.40001 45.0886 10.9113 47.5999 14 47.5999H42C45.0888 47.5999 47.6 45.0886 47.6 41.9999V13.9999ZM25.8125 35.7874C26.635 36.6099 27.965 36.6099 28.7788 35.7874C29.5925 34.9649 29.6013 33.6349 28.7788 32.8211L26.0663 30.1087H35C36.1638 30.1087 37.1 29.1724 37.1 28.0087C37.1 26.8449 36.1638 25.9087 35 25.9087H26.0663L28.7788 23.1962C29.6013 22.3737 29.6013 21.0437 28.7788 20.2299C27.9563 19.4162 26.6263 19.4074 25.8125 20.2299L19.5125 26.5299C18.69 27.3524 18.69 28.6824 19.5125 29.4962L25.8125 35.7962V35.7874Z"
                fill="#990000"
              />
            </svg>
          </button>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentTestimonial}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.5,
              }}
            >
              <TestimonialCard
                quoteIcon={quoteIcon}
                name={testimonials[currentTestimonial].name}
                renter={testimonials[currentTestimonial].renter}
                description={testimonials[currentTestimonial].description}
                image={testimonials[currentTestimonial].image}
              />
            </motion.div>
          </AnimatePresence>
          <button className="cursor-pointer" onClick={nextTestimonial}>
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M12.6 14.0001V42.0001C12.6 42.7701 13.23 43.4001 14 43.4001H42C42.77 43.4001 43.4 42.7701 43.4 42.0001V14.0001C43.4 13.2301 42.77 12.6001 42 12.6001H14C13.23 12.6001 12.6 13.2301 12.6 14.0001ZM18.9 28.0001C18.9 26.8363 19.8362 25.9001 21 25.9001H29.9337L27.2212 23.1876C26.3987 22.3651 26.3987 21.0351 27.2212 20.2213C28.0437 19.4076 29.3737 19.3988 30.1875 20.2213L36.4875 26.5213C37.31 27.3438 37.31 28.6738 36.4875 29.4876L30.1875 35.7876C29.365 36.6101 28.035 36.6101 27.2212 35.7876C26.4075 34.9651 26.3987 33.6351 27.2212 32.8213L29.9337 30.1088H21C19.8362 30.1088 18.9 29.1726 18.9 28.0088V28.0001Z"
                fill="#990000"
              />
              <path
                d="M14 12.5999C13.23 12.5999 12.6 13.2299 12.6 13.9999V41.9999C12.6 42.7699 13.23 43.3999 14 43.3999H42C42.77 43.3999 43.4 42.7699 43.4 41.9999V13.9999C43.4 13.2299 42.77 12.5999 42 12.5999H14ZM8.40002 13.9999C8.40002 10.9112 10.9113 8.3999 14 8.3999H42C45.0888 8.3999 47.6 10.9112 47.6 13.9999V41.9999C47.6 45.0886 45.0888 47.5999 42 47.5999H14C10.9113 47.5999 8.40002 45.0886 8.40002 41.9999V13.9999ZM30.1875 35.7874C29.365 36.6099 28.035 36.6099 27.2213 35.7874C26.4075 34.9649 26.3988 33.6349 27.2213 32.8211L29.9338 30.1087H21C19.8363 30.1087 18.9 29.1724 18.9 28.0087C18.9 26.8449 19.8363 25.9087 21 25.9087H29.9338L27.2213 23.1962C26.3988 22.3737 26.3988 21.0437 27.2213 20.2299C28.0438 19.4162 29.3738 19.4074 30.1875 20.2299L36.4875 26.5299C37.31 27.3524 37.31 28.6824 36.4875 29.4962L30.1875 35.7962V35.7874Z"
                fill="#990000"
              />
            </svg>
          </button>
        </div>
        {/* Indicator Dots */}
        <div className="flex justify-center items-center gap-2 my-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-6 h-6 rounded-full transition-colors ${
                index === currentTestimonial
                  ? "bg-red-800"
                  : "bg-gray-300 hover:bg-zinc-300"
              }`}
            />
          ))}
        </div>
        <footer className="bg-zinc-100 text-stone-950 flex px-36 py-10 justify-between items-start gap-28">
          <div className="flex flex-col gap-9 max-w-[368px]">
            <Image
              width={2109}
              height={810}
              alt="logo footer"
              src="/lendr-log-gradient.png"
              className="w-[179px]"
            ></Image>
            <p className="text-lg font-medium">
              Platform designed to create an online marketplace exclusively for
              RENT
            </p>
          </div>
          <div className="footer-links">
            <ul className="flex flex-col gap-3">
              <li>
                <span className="text-red-800 text-base font-bold">
                  Quick Links
                </span>
              </li>
              <li>
                <Link href="#home">Home</Link>
              </li>
              <li>
                <Link href="#browse">Browse Rentals</Link>
              </li>
              <li>
                <Link href="#categories">Categories</Link>
              </li>
              <li>
                <Link href="#aboutUs">About Us</Link>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <ul className="flex flex-col gap-3">
              <li>
                <span className="text-red-800 text-base font-bold">
                  Contact
                </span>
              </li>
              <li>
                <p>Call:</p>
                <p>09123456789</p>
              </li>
              <li>
                <p>Email:</p>
                <p>lendr@gmail.com</p>
              </li>
            </ul>
          </div>
          <div className="footer-links justify-start">
            <ul className="flex flex-col gap-3">
              <li>
                <span className="text-red-800 text-base font-bold">
                  Social Media
                </span>
              </li>
              <li>
                <svg
                  width="172"
                  height="27"
                  viewBox="0 0 172 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="12.8571"
                    cy="13.5715"
                    rx="12.8571"
                    ry="12.8571"
                    fill="#E93740"
                  />
                  <path
                    d="M12.8551 11.0705C11.4779 11.0705 10.3541 12.1944 10.3541 13.5715C10.3541 14.9487 11.4779 16.0726 12.8551 16.0726C14.2323 16.0726 15.3561 14.9487 15.3561 13.5715C15.3561 12.1944 14.2323 11.0705 12.8551 11.0705ZM20.3563 13.5715C20.3563 12.5358 20.3657 11.5095 20.3075 10.4757C20.2493 9.27488 19.9754 8.20916 19.0973 7.33107C18.2174 6.4511 17.1536 6.17904 15.9528 6.12087C14.9171 6.06271 13.8908 6.07209 12.857 6.07209C11.8213 6.07209 10.795 6.06271 9.76119 6.12087C8.5604 6.17904 7.4947 6.45297 6.61663 7.33107C5.73667 8.21104 5.46462 9.27488 5.40646 10.4757C5.34829 11.5114 5.35767 12.5377 5.35767 13.5715C5.35767 14.6054 5.34829 15.6336 5.40646 16.6674C5.46462 17.8682 5.73855 18.9339 6.61663 19.812C7.49658 20.692 8.5604 20.964 9.76119 21.0222C10.7969 21.0804 11.8232 21.071 12.857 21.071C13.8927 21.071 14.919 21.0804 15.9528 21.0222C17.1536 20.964 18.2193 20.6901 19.0973 19.812C19.9773 18.932 20.2493 17.8682 20.3075 16.6674C20.3675 15.6336 20.3563 14.6072 20.3563 13.5715ZM12.8551 17.4198C10.7256 17.4198 9.00695 15.7011 9.00695 13.5715C9.00695 11.442 10.7256 9.72331 12.8551 9.72331C14.9846 9.72331 16.7033 11.442 16.7033 13.5715C16.7033 15.7011 14.9846 17.4198 12.8551 17.4198ZM16.8609 10.4644C16.3637 10.4644 15.9621 10.0629 15.9621 9.5657C15.9621 9.06849 16.3637 8.66697 16.8609 8.66697C17.3581 8.66697 17.7596 9.06849 17.7596 9.5657C17.7597 9.68377 17.7366 9.8007 17.6915 9.90981C17.6464 10.0189 17.5802 10.118 17.4967 10.2015C17.4132 10.285 17.3141 10.3512 17.205 10.3963C17.0959 10.4414 16.9789 10.4646 16.8609 10.4644Z"
                    fill="white"
                  />
                  <ellipse
                    cx="49.2854"
                    cy="12.8571"
                    rx="12.8571"
                    ry="12.8571"
                    fill="#E93740"
                  />
                  <path
                    d="M56.7854 7.95055C56.2238 8.21298 55.628 8.38515 55.018 8.46133C55.6605 8.05583 56.1414 7.41774 56.3709 6.66599C55.7669 7.04415 55.106 7.31045 54.4169 7.45332C54.1289 7.12939 53.781 6.87129 53.3946 6.695C53.0082 6.51871 52.5916 6.42799 52.1706 6.42847C50.4712 6.42847 49.0932 7.88151 49.0932 9.67439C49.0932 9.92855 49.1205 10.1765 49.1731 10.4143C46.6154 10.2789 44.348 8.9865 42.8301 7.02247C42.5564 7.51785 42.4126 8.08111 42.4134 8.65447C42.413 9.18888 42.5378 9.71513 42.7766 10.1864C43.0155 10.6578 43.361 11.0595 43.7825 11.3561C43.2939 11.3397 42.816 11.2006 42.3887 10.9501C42.3883 10.9637 42.3883 10.977 42.3883 10.991C42.3883 12.5632 43.449 13.8751 44.8566 14.1736C44.4033 14.3031 43.9281 14.322 43.4669 14.2291C43.8584 15.5184 44.9949 16.4572 46.3415 16.4835C45.2514 17.3858 43.9053 17.8752 42.5196 17.873C42.2712 17.873 42.0264 17.8578 41.7854 17.8276C43.1925 18.7812 44.8301 19.2874 46.5026 19.2856C52.163 19.2856 55.2584 14.3399 55.2584 10.051C55.2584 9.91047 55.2553 9.77014 55.2494 9.63063C55.8522 9.1716 56.3724 8.60263 56.7854 7.95055Z"
                    fill="white"
                  />
                  <circle
                    cx="85.7141"
                    cy="12.8571"
                    r="12.8571"
                    fill="#E93740"
                  />
                  <path
                    d="M92.901 9.1423C92.8156 8.82428 92.6482 8.53427 92.4155 8.30129C92.1828 8.0683 91.893 7.90052 91.5751 7.81473C90.4049 7.5 85.7141 7.5 85.7141 7.5C85.7141 7.5 81.0232 7.5 79.853 7.81306C79.535 7.89857 79.245 8.06626 79.0123 8.29929C78.7795 8.53231 78.6122 8.82247 78.5271 9.14063C78.2141 10.3125 78.2141 12.7567 78.2141 12.7567C78.2141 12.7567 78.2141 15.2009 78.5271 16.3711C78.6995 17.0173 79.2085 17.5262 79.853 17.6987C81.0232 18.0134 85.7141 18.0134 85.7141 18.0134C85.7141 18.0134 90.4049 18.0134 91.5751 17.6987C92.2213 17.5262 92.7286 17.0173 92.901 16.3711C93.214 15.2009 93.2141 12.7567 93.2141 12.7567C93.2141 12.7567 93.214 10.3125 92.901 9.1423ZM84.2241 15V10.5134L88.108 12.74L84.2241 15Z"
                    fill="white"
                  />
                  <ellipse
                    cx="122.143"
                    cy="12.8571"
                    rx="12.8571"
                    ry="12.8571"
                    fill="#E93740"
                  />
                  <path
                    d="M119.772 20.3571V13.8395H117.857V10.7985H119.772V8.20109C119.772 6.16002 120.903 4.28564 123.509 4.28564C124.564 4.28564 125.344 4.40363 125.344 4.40363L125.282 7.24342C125.282 7.24342 124.487 7.23439 123.618 7.23439C122.679 7.23439 122.528 7.73956 122.528 8.57801V10.7985H125.357L125.234 13.8395H122.528V20.3571H119.772Z"
                    fill="white"
                  />
                  <ellipse
                    cx="158.572"
                    cy="12.8571"
                    rx="12.8571"
                    ry="12.8571"
                    fill="#E93740"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M156.643 10.5839H159.429V11.9714C159.83 11.1734 160.859 10.4564 162.405 10.4564C165.368 10.4564 166.072 12.0449 166.072 14.9594V20.3572H163.072V15.6232C163.072 13.9634 162.67 13.0274 161.649 13.0274C160.232 13.0274 159.643 14.0362 159.643 15.6224V20.3572H156.643V10.5839ZM151.499 20.2297H154.499V10.4564H151.499V20.2297ZM154.929 7.26968C154.929 7.52113 154.879 7.7701 154.782 8.00212C154.685 8.23413 154.543 8.44456 154.364 8.62118C154.001 8.98165 153.51 9.18342 152.999 9.18218C152.489 9.18184 151.999 8.98058 151.636 8.62193C151.457 8.44471 151.316 8.23405 151.219 8.002C151.122 7.76996 151.072 7.5211 151.072 7.26968C151.072 6.76193 151.274 6.27593 151.636 5.91743C151.999 5.5583 152.489 5.35695 153 5.35718C153.511 5.35718 154.002 5.55893 154.364 5.91743C154.726 6.27593 154.929 6.76193 154.929 7.26968Z"
                    fill="white"
                  />
                </svg>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <ul className="flex flex-col gap-3">
              <li>
                <span className="text-red-800 text-base font-bold">
                  View Map
                </span>
              </li>
              <li>
                <Image
                  width={640}
                  height={640}
                  alt="photo of map"
                  src="/map.png"
                  className="self-stretch h-44"
                ></Image>
              </li>
            </ul>
          </div>
        </footer>
        <div className="text-white text-base font-normal bg-red-800 flex px-36 py-4 justify-between">
          <div>
            <p>© 2025 Lendr. All Rights Reserved. </p>
          </div>
          <div className="flex gap-11">
            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
