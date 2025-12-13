"use client";

import { useState } from "react";
import Input from "./Input";

const formFields = {
  search: [
    {
      label: "Search",
      type: "text",
      id: "search",
      placeholder: "What are you looking for?",
    },
    {
      label: "location",
      type: "text",
      id: "location",
      placeholder: "What are you looking for?",
    },
    {
      label: "Start Date",
      type: "date",
      id: "startDate",
      placeholder: "Add Date",
    },
    { label: "End Date", type: "date", id: "endDate", placeholder: "Add Date" },
  ],
};

export default function Search() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Validate dates
  const validateDates = (start, end) => {
    if (!start || !end) {
      setDateError("");
      return true;
    }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const today = new Date(getTodayDate());

    // Check if start date is in the past
    if (startDateObj < today) {
      setDateError("Start date cannot be in the past");
      return false;
    }

    // Check if end date is before start date
    if (endDateObj < startDateObj) {
      setDateError("End date cannot be before start date");
      return false;
    }

    // Check if end date is the same as start date (same-day edge case)
    if (endDateObj.getTime() === startDateObj.getTime()) {
      setDateError("End date must be at least one day after start date");
      return false;
    }

    setDateError("");
    return true;
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    validateDates(newStartDate, endDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    validateDates(startDate, newEndDate);
  };

  return (
    <>
      {formFields.search.map((field) => {
        // Handle date fields with validation
        if (field.id === "startDate") {
          return (
            <Input
              key={field.id}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              name={field.id}
              id={field.id}
              value={startDate}
              onChange={handleStartDateChange}
              min={getTodayDate()}
              required={false}
              containerClassName="w-full lg:w-auto"
              className="w-full lg:w-48 xl:w-56"
            />
          );
        }

        if (field.id === "endDate") {
          return (
            <Input
              key={field.id}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              name={field.id}
              id={field.id}
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate || getTodayDate()}
              required={false}
              containerClassName="w-full lg:w-auto"
              className="w-full lg:w-48 xl:w-56"
            />
          );
        }

        // Regular text fields
        return (
          <Input
            key={field.id}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            name={field.id}
            id={field.id}
            required={false}
            containerClassName="w-full lg:w-auto"
            className="w-full lg:w-48 xl:w-56"
          />
        );
      })}
      {dateError && (
        <div className="w-full lg:w-auto">
          <p className="text-red-600 text-sm font-medium px-2">{dateError}</p>
        </div>
      )}
    </>
  );
}
