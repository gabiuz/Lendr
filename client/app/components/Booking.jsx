"use client";

import Image from "next/image";
import { useState } from "react";

export default function Booking({ isOpen = false, onClose = () => {} }) {
  const [selectedDates, setSelectedDates] = useState({
    start: null,
    end: null,
  });
  const [monthOffset, setMonthOffset] = useState(0);

  // Get current month and next month based on offset
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset + 1, 1);

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
          className={`h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all
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
      <div className="mb-3">
        {/* Month header with navigation */}
        <div className="flex justify-between items-center mb-2">
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
          <h3 className="text-sm font-bold text-gray-800">{monthName}</h3>
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
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="h-6 flex items-center justify-center text-xs font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
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
            className="bg-white rounded-2xl shadow-2xl w-fit max-w-6xl mx-auto overflow-hidden animate-slideUp max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-container py-6 px-10 overflow-y-auto">
              <div className="red-line mx-auto"></div>
              <div className="modal-header flex justify-between items-center">
                <h1 className="text-2xl font-extrabold w-full mt-3 flex justify-center">
                  Booking Page
                </h1>
              </div>
              <div className="modal-body mt-3">
                <div className="calendar-column w-full">
                  {/* Booking Details */}
                  <div className="product-info mb-3">
                    <h3 className="text-xl font-extrabold mb-1">
                      Canon EOS 90D
                    </h3>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2.5 mb-4">
                    <Image
                      width={40}
                      height={40}
                      className="rounded-full"
                      src="/pictures/sample-pfp-productCard.png"
                      alt="profile photo image"
                    />
                    <div className="w-52 inline-flex flex-col justify-start items-start">
                      <div className="self-stretch justify-start text-black text-base font-semibold font-['Montserrat'] leading-5">
                        Rental Owner Name
                      </div>
                      <div className="self-stretch justify-start text-zinc-800 text-sm font-normal font-['Montserrat'] leading-5">
                        Rental Owner
                      </div>
                    </div>
                  </div>


                  <h2 className="text-xl font-bold mb-3">Select Dates</h2>

                  {/* Two Months Side by Side */}
                  <div className="flex gap-4">
                    <div className="flex-1">{renderCalendar(currentMonth)}</div>
                    <div className="flex-1">{renderCalendar(nextMonth)}</div>
                  </div>

                  {/* Selected Dates Display */}
                  {selectedDates.start && (
                    <div className="mt-3 p-2.5 bg-gray-100 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700">
                        Start: {selectedDates.start.toLocaleDateString()}
                      </p>
                      {selectedDates.end && (
                        <p className="text-xs font-semibold text-gray-700">
                          End: {selectedDates.end.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 mt-4">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
