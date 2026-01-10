"use client";
import Image from "next/image";

export const quoteIcon = {
  width: 65,
  height: 65,
  viewBox: "0 0 65 65",
  rect: {
    width: 65,
    height: 65,
    rx: 32.5,
    fill: "#FDEBEC",
  },
  paths: [
    {
      opacity: 0.4,
      d: "M18.4212 35.586C18.4212 34.2793 19.4769 33.2236 20.7836 33.2236H25.5084C26.8151 33.2236 27.8708 34.2793 27.8708 35.586V40.3108C27.8708 41.6175 26.8151 42.6732 25.5084 42.6732H20.7836C19.4769 42.6732 18.4212 41.6175 18.4212 40.3108V35.586ZM37.3204 35.586C37.3204 34.2793 38.3761 33.2236 39.6828 33.2236H44.4076C45.7143 33.2236 46.77 34.2793 46.77 35.586V40.3108C46.77 41.6175 45.7143 42.6732 44.4076 42.6732H39.6828C38.3761 42.6732 37.3204 41.6175 37.3204 40.3108V35.586Z",
      fill: "#990000",
    },
    {
      d: "M16.0588 29.6802C16.0588 25.1105 19.7574 21.4119 24.3272 21.4119H26.6896C27.3393 21.4119 27.8708 21.9434 27.8708 22.5931C27.8708 23.2427 27.3393 23.7743 26.6896 23.7743H24.3272C21.0641 23.7743 18.4212 26.4172 18.4212 29.6802V31.4963C19.1152 31.0977 19.9199 30.8614 20.7836 30.8614H25.5084C28.1144 30.8614 30.2332 32.9802 30.2332 35.5862V40.311C30.2332 42.917 28.1144 45.0358 25.5084 45.0358H20.7836C18.1776 45.0358 16.0588 42.917 16.0588 40.311V29.6802ZM18.4212 35.5862V40.311C18.4212 41.6177 19.4769 42.6734 20.7836 42.6734H25.5084C26.8151 42.6734 27.8708 41.6177 27.8708 40.311V35.5862C27.8708 34.2795 26.8151 33.2238 25.5084 33.2238H20.7836C19.4769 33.2238 18.4212 34.2795 18.4212 35.5862ZM44.4076 33.2238H39.6828C38.3761 33.2238 37.3204 34.2795 37.3204 35.5862V40.311C37.3204 41.6177 38.3761 42.6734 39.6828 42.6734H44.4076C45.7143 42.6734 46.77 41.6177 46.77 40.311V35.5862C46.77 34.2795 45.7143 33.2238 44.4076 33.2238ZM34.958 37.9486V29.6802C34.958 25.1105 38.6566 21.4119 43.2264 21.4119H45.5888C46.2384 21.4119 46.77 21.9434 46.77 22.5931C46.77 23.2427 46.2384 23.7743 45.5888 23.7743H43.2264C39.9633 23.7743 37.3204 26.4172 37.3204 29.6802V31.4963C38.0143 31.0977 38.819 30.8614 39.6828 30.8614H44.4076C47.0136 30.8614 49.1324 32.9802 49.1324 35.5862V40.311C49.1324 42.917 47.0136 45.0358 44.4076 45.0358H39.6828C37.0768 45.0358 34.958 42.917 34.958 40.311V37.9486Z",
      fill: "#990000",
    },
  ],
};

export default function TestimonialCard({
  quoteIcon,
  name,
  renter,
  description,
  image,
}) {
  return (
    <>
      <div className="p-7 bg-zinc-100 rounded-3xl flex flex-col justify-start items-start gap-6 w-[936px] mx-auto mt-24">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center items-center w-24 h-24 bg-pink-100 rounded-[300px]">
            <svg
              width={quoteIcon.width}
              height={quoteIcon.height}
              viewBox={quoteIcon.viewBox}
              fill={quoteIcon.fill}
              xmlns="http://www.w3.org/2000/svg"
            >
              {quoteIcon.paths.map((path, index) => (
                <path
                  key={`path-${index}`}
                  opacity={path.opacity}
                  d={path.d}
                  fill={path.fill}
                />
              ))}
            </svg>
          </div>
          <div className="text-black text-xl font-medium">{description}</div>
        </div>
        <hr className="w-full border-light-gray" />
        <div className="flex justify-center items-center gap-4">
          <Image
            width={65}
            height={65}
            alt="profile-photo-image"
            src={image}
            className="w-16"
          ></Image>
          <div>
            <div className="text-zinc-800 text-2xl font-semibold">{name}</div>
            <div className="text-zinc-800 text-base font-medium">{renter}</div>
          </div>
        </div>
      </div>
    </>
  );
}
