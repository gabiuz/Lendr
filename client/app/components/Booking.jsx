"use client";

import Image from "next/image";
import { useState } from "react";

export default function Booking({ isOpen = false, onClose = () => {} }) {
  const [selectedDates, setSelectedDates] = useState({
    start: null,
    end: null,
  });
  const [monthOffset, setMonthOffset] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("");

  // Get current month and next month based on offset
  const today = new Date();
  const currentMonth = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1
  );
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset + 1,
    1
  );

  // Navigation handlers
  const goToPreviousMonth = () => setMonthOffset(monthOffset - 1);
  const goToNextMonth = () => setMonthOffset(monthOffset + 1);

  // Helper function to get days in a month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  // Handle date selection
  const handleDateClick = (date) => {
    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Start new selection
      setSelectedDates({ start: date, end: null });
    } else if (date > selectedDates.start) {
      // Set end date
      setSelectedDates({ ...selectedDates, end: date });
    } else {
      // If clicking before start date, reset
      setSelectedDates({ start: date, end: null });
    }
  };

  // Check if date is in selected range
  const isDateInRange = (date) => {
    if (!selectedDates.start) return false;
    if (!selectedDates.end)
      return date.getTime() === selectedDates.start.getTime();
    return date >= selectedDates.start && date <= selectedDates.end;
  };

  // Check if date is start or end
  const isStartDate = (date) =>
    selectedDates.start && date.getTime() === selectedDates.start.getTime();
  const isEndDate = (date) =>
    selectedDates.end && date.getTime() === selectedDates.end.getTime();

  // Render calendar for a specific month
  const renderCalendar = (baseDate, isFirstMonth = false) => {
    const { daysInMonth, startingDayOfWeek, year, month } =
      getDaysInMonth(baseDate);
    const monthName = baseDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast =
        date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const inRange = isDateInRange(date);
      const isStart = isStartDate(date);
      const isEnd = isEndDate(date);

      days.push(
        <button
          key={day}
          onClick={() => !isPast && handleDateClick(date)}
          disabled={isPast}
          className={`h-5 lg:h-8 px-1 lg:px-3 py-1 lg:py-3 flex items-center justify-center rounded-lg text-[9px] lg:text-sm font-normal transition-all
            ${
              isPast
                ? "text-gray-300 cursor-not-allowed"
                : "cursor-pointer hover:bg-red-100"
            }
            ${isToday && !inRange ? "border border-red-600" : ""}
            ${inRange ? "bg-red-600 text-white" : "text-gray-800"}
            ${isStart || isEnd ? "bg-red-700 font-bold" : ""}
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="mb-1.5 lg:mb-3">
        {/* Month header with navigation */}
        <div className="flex justify-between items-center mb-0.5 lg:mb-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            aria-label="Previous month"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h3 className="text-[10px] lg:text-sm font-medium text-neutral-600">{monthName}</h3>
          <button
            onClick={goToNextMonth}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            aria-label="Next month"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 lg:gap-2 mb-0.5 lg:mb-1 px-1 lg:px-3 py-1 lg:py-3 bg-slate-100">
          {["S", "M", "T", "W", "Th", "F", "Sa"].map((day) => (
            <div
              key={day}
              className="h-3 lg:h-6 w-3 lg:w-6 flex items-center justify-center text-[8px] lg:text-sm font-normal text-neutral-700"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5 lg:gap-2 px-1 lg:px-3 py-1 lg:py-3">{days}</div>
      </div>
    );
  };
  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-fit max-w-3xl xl:max-w-7xl mx-auto overflow-hidden animate-slideUp max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-container py-2 px-2 lg:py-16 xl:py-24 lg:px-12 xl:px-20 overflow-y-hidden">
              <div className="red-line mx-auto"></div>
              <div className="modal-header flex justify-between items-center">
                <h1 className="text-base lg:text-3xl xl:text-4xl font-extrabold w-full mt-1 lg:mt-6 xl:mt-10 flex justify-center">
                  Booking Page
                </h1>
              </div>
              <div className="modal-body mt-1.5 lg:mt-8 xl:mt-10 grid grid-cols-2 gap-2 lg:gap-12 xl:gap-20">
                <div className="calendar-column w-full flex flex-col gap-1 lg:gap-5 xl:gap-6">
                  {/* Booking Details */}
                  <div className="product-info mb-0.5 lg:mb-2.5 xl:mb-3">
                    <h3 className="text-base lg:text-3xl xl:text-4xl font-bold mb-0">Canon EOS 90D</h3>
                  </div>
                  <div className="inline-flex justify-start items-center gap-1 mb-1 lg:mb-4">
                    <Image
                      width={24}
                      height={24}
                      className="rounded-full"
                      src="/pictures/sample-pfp-productCard.png"
                      alt="profile photo image"
                    />
                    <div className="w-32 lg:w-52 inline-flex flex-col justify-start items-start">
                      <div className="self-stretch justify-start text-black text-[10px] lg:text-base font-semibold leading-3">
                        Rental Owner Name
                      </div>
                      <div className="self-stretch justify-start text-zinc-800 text-[8px] lg:text-sm font-normal leading-3">
                        Rental Owner
                      </div>
                    </div>
                  </div>
                  {/* Two Months Side by Side */}
                  <div className="border border-gray-200 rounded-lg p-0.5 lg:p-3 xl:p-4 shadow-xl">
                    <div className="flex gap-0.5 lg:gap-3 xl:gap-4">
                      <div className="flex-1">
                        {renderCalendar(currentMonth)}
                      </div>
                      <div className="flex-1">{renderCalendar(nextMonth)}</div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4">
                      {/* Selected Dates Display */}
                      {selectedDates.start && (
                        <p className="text-xs font-base text-gray-700">
                          <span>
                            {selectedDates.start.toLocaleDateString()}
                          </span>
                          <span> - </span>
                          {selectedDates.end && (
                            <span>
                              {selectedDates.end.toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      )}
                      {/* Action Buttons */}
                      <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Handle apply/booking logic here
                          console.log("Selected dates:", selectedDates);
                          onClose();
                        }}
                        disabled={!selectedDates.start || !selectedDates.end}
                        className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedDates.start && selectedDates.end
                            ? "bg-red-600 hover:bg-red-700 text-white hover:shadow-md"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Column - Placeholder */}
                <div className="rental-details w-full">
                  <div className="border border-gray-200 rounded-lg h-full px-2 lg:px-6 xl:px-8 py-2 lg:py-8 xl:py-10">
                    <div className="rental-date-container flex justify-between items-start gap-1 lg:gap-3 xl:gap-4">
                      <h2 className="font-extrabold text-[10px] lg:text-base pt-1.5 lg:pt-3.5">
                        Rental Date:
                      </h2>
                      <div className="dates flex flex-col gap-1 lg:gap-2.5">
                        <p className="font-extrabold text-[10px] lg:text-base border border-gray-200 p-1.5 lg:p-3 xl:p-3.5 rounded-lg">
                          Start Date:{" "}
                          <span className="font-normal">
                            {selectedDates.start
                              ? selectedDates.start.toLocaleDateString()
                              : today.toLocaleDateString()}
                          </span>
                        </p>
                        <p className="font-extrabold text-sm lg:text-base border border-gray-200 p-2.5 lg:p-3 xl:p-3.5 rounded-lg">
                          End Date:{" "}
                          <span className="font-normal">
                            {selectedDates.end
                              ? selectedDates.end.toLocaleDateString()
                              : "   "}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="payment-container flex items-center justify-between pt-2 lg:pt-5 pr-6 lg:pr-18 xl:pr-24">
                      <h2 className="font-extrabold text-[10px] lg:text-base">Payment Method:</h2>
                      <div className="payment flex gap-1 lg:gap-2.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="gcash"
                            checked={paymentMethod === "gcash"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-[10px] lg:text-base font-normal">GCash</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={paymentMethod === "cash"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-[10px] lg:text-base font-normal">Cash</span>
                        </label>
                      </div>
                    </div>
                    <div className="delivery-container flex items-center justify-between gap-2 lg:gap-3 pt-2 lg:pt-5">
                      <h2 className="font-extrabold text-[10px] lg:text-base">Delivery Options:</h2>
                      <div className="delivery flex gap-1 lg:gap-2.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="deliveryOption"
                            value="pickup"
                            checked={deliveryOption === "pickup"}
                            onChange={(e) => setDeliveryOption(e.target.value)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-[10px] lg:text-base font-normal">Pick up</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="deliveryOption"
                            value="lalamove"
                            checked={deliveryOption === "lalamove"}
                            onChange={(e) => setDeliveryOption(e.target.value)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-[10px] lg:text-base font-normal">Delivery via Lalamove</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
