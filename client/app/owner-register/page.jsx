"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RadioButtons from "../components/RadioButtons";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";

export default function OwnerRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formFields = {
    businessInfo: [
      {
        label: "Business Name",
        id: "businessName",
        type: "text",
        placeholder: "Your Business Name",
      },
      {
        label: "Contact Email",
        id: "email",
        type: "email",
        placeholder: "business@email.com",
      },
      {
        label: "Contact Number",
        id: "contactNo",
        type: "tel",
        placeholder: "+63",
      },
    ],
    businessAddress: [
      {
        label: "Business Address",
        id: "businessAddress",
        type: "text",
        placeholder: "123 st. Metro Manila",
      },
      {
        label: "Postal Code",
        id: "postalCode",
        type: "number",
        placeholder: "1234",
      },
    ]
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.target);
      // Check if user is already logged in
      const customer_id = localStorage.getItem('customer_id');
      const payload = {
        contact_email: fd.get('email'),
        contact_number: fd.get('contactNo'),
        business_name: fd.get('businessName'),
        business_address: fd.get('businessAddress'),
        postal_code: fd.get('postalCode'),
      };
      // If logged in, include their customer_id
      if (customer_id) {
        payload.customer_id = customer_id;
      }

      const res = await fetch('/api/owner-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('owner_id', data.owner_id);
        router.push('/owner-homepage');
      } else {
        console.error(data.error);
        alert('Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Registration error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[url('/bg-image-register.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="flex justify-center w-full pt-6 md:justify-center lg:justify-start lg:pl-24 lg:pt-16">
        <Image src="/lendr-logo.png" alt="Lendr Logo" width={142} height={54} />
      </div>
      <div className="flex lg:justify-end lg:items-end">
        <form className="register w-full lg:w-5xl" onSubmit={handleSubmit}>
          <div className="bg-white px-6 py-10 lg:px-22 lg:py-20 lg:mr-28">
            <div className="red-line mx-auto mb-8"></div>
            <div className="flex flex-col justify-center items-center lg:mb-8 lg:items-start">
              <h1 className="text-2xl font-bold text-black mt-0 mb-1 w-fit text-center lg:text-5xl">
                Create a Business Account<span className="m-0 p-0 text-red">.</span>
              </h1>
              <p className="text-sm text-black mb-6 lg:text-base">
                Fill up the following:
              </p>
            </div>
            <div className="business-info flex flex-col gap-4 mb-4 lg:flex-row">
              {formFields.businessInfo.map((field) => (
                <Input
                  key={field.id}
                  label={field.label}
                  htmlFor={field.id}
                  type={field.type}
                  name={field.id}
                  id={field.id}
                  required={true}
                  placeholder={field.placeholder}
                  containerClassName="w-full"
                />
              ))}
            </div>
            <div className="business-address flex flex-col gap-4 mb-4 lg:flex-row">
              {formFields.businessAddress.map((field) => (
                <Input
                  key={field.id}
                  label={field.label}
                  htmlFor={field.id}
                  type={field.type}
                  name={field.id}
                  id={field.id}
                  required={true}
                  placeholder={field.placeholder}
                  containerClassName="w-full"
                />
              ))}
            </div>
            <div className="button-container flex flex-row justify-between gap-3 lg:justify-end">
              <Button
                label="Cancel"
                className="text-light-gray flex-1 lg:flex-0 hover:text-red hover:border-red"
                onClick={(e) => {
                  e.preventDefault();
                   router.push('/homepage');
                }}
              />
              <button
                type="submit"
                className="text-white bg-light-gray flex-1 lg:flex-0 hover:bg-red hover:border-red font-semibold border-2 border-light-gray px-[26px]! py-2.5! rounded-[11px]! cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
