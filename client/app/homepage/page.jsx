"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import InfoCard from "../components/Infocard";
import Footer from "../components/Footer";
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
      prev === 0 ? testimonials.length - 1 : prev - 1
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
      <div className="category-container bg-white" id="categories">
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
      <div className="flex justify-center items-baseline text-center mt-32 mb-20">
        <h2 className="text-black text-5xl font-bold">
          Most Rented Items Near You
        </h2>
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
      </div>
      <Footer />
    </div>
  );
}
