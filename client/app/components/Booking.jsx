"use client";

import Image from "next/image";
import { useState } from "react";

export default function Booking({ isOpen = false, onClose = () => {} }) {
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });

  // Get current month and next month
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

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
    if (!selectedDates.end) return date.getTime() === selectedDates.start.getTime();
    return date >= selectedDates.start && date <= selectedDates.end;
  };

  // Check if date is start or end
  const isStartDate = (date) => selectedDates.start && date.getTime() === selectedDates.start.getTime();
  const isEndDate = (date) => selectedDates.end && date.getTime() === selectedDates.end.getTime();

  // Render calendar for a specific month
  const renderCalendar = (baseDate) => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(baseDate);
    const monthName = baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const inRange = isDateInRange(date);
      const isStart = isStartDate(date);
      const isEnd = isEndDate(date);

      days.push(
        <button
          key={day}
          onClick={() => !isPast && handleDateClick(date)}
          disabled={isPast}
          className={`h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all
            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-red-100'}
            ${isToday && !inRange ? 'border-2 border-red-600' : ''}
            ${inRange ? 'bg-red-600 text-white' : 'text-gray-800'}
            ${isStart || isEnd ? 'bg-red-700 font-bold' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-gray-800">{monthName}</h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
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
            className="bg-white rounded-2xl shadow-2xl w-fit max-w-6xl mx-auto overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-container py-24 px-28">
              <div className="red-line mx-auto"></div>
              <div className="modal-header flex justify-between items-center">
                <h1 className="text-4xl font-extrabold w-full mt-11">
                  Booking Page
                </h1>
              </div>
              <div className="modal-body grid grid-cols-2 gap-12 mt-6">
                <div className="calendar-column w-full">
                  <h2 className="text-2xl font-bold mb-4">Select Dates</h2>
                  
                  {/* Two Months Side by Side */}
                  <div className="flex gap-6">
                    <div className="flex-1">
                      {renderCalendar(currentMonth)}
                    </div>
                    <div className="flex-1">
                      {renderCalendar(nextMonth)}
                    </div>
                  </div>
                  
                  {/* Selected Dates Display */}
                  {selectedDates.start && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700">
                        Start: {selectedDates.start.toLocaleDateString()}
                      </p>
                      {selectedDates.end && (
                        <p className="text-sm font-semibold text-gray-700">
                          End: {selectedDates.end.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="column-2 w-full">
                  <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
                  <div className="inline-flex justify-start items-center gap-3.5 mb-4">
                    <Image
                      width={54}
                      height={54}
                      className="rounded-full"
                      src="/pictures/sample-pfp-productCard.png"
                      alt="profile photo image"
                    />
                    <div className="w-52 inline-flex flex-col justify-start items-start">
                      <div className="self-stretch justify-start text-black text-xl font-semibold font-['Montserrat'] leading-6">
                        Rental Owner Name
                      </div>
                      <div className="self-stretch justify-start text-zinc-800 text-base font-normal font-['Montserrat'] leading-6">
                        Rental Owner
                      </div>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="text-lg font-semibold mb-2">Canon EOS 90D</h3>
                    <p className="text-gray-600">Select your rental dates from the calendar</p>
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
