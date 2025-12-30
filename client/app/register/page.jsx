"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RadioButtons from "../components/RadioButtons";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formFields = {
    name: [
      { label: "First Name", id: "FirstName", placeholder: "First Name" },
      { label: "Middle Name", id: "MiddleName", placeholder: "Middle Name" },
      { label: "Last Name", id: "LastName", placeholder: "Last Name" },
    ],
    sex: [
      { label: "Male", id: "male", value: "male" },
      { label: "Female", id: "female", value: "female" },
      { label: "Prefer Not to Say", id: "other", value: "other" },
    ],
    emailAndPass: [
      {
        label: "Email",
        id: "email",
        type: "email",
        placeholder: "Abcde@gmail.com",
      },
      {
        label: "Password",
        id: "password",
        type: "password",
        placeholder: "*********",
      },
    ],
    addressAndPhone: [
      {
        label: "Address",
        id: "address",
        type: "text",
        placeholder: "123 st. Metro Manila",
      },
      {
        label: "Phone Number",
        id: "contactNo",
        type: "tel",
        placeholder: "+63",
      },
    ],
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.target);
      const payload = {
        first_name: fd.get('FirstName'),
        middle_name: fd.get('MiddleName'),
        last_name: fd.get('LastName'),
        gender: fd.get('sex'),
        birthday: fd.get('bday'),
        email: fd.get('email'),
        password: fd.get('password'),
        phone_number: fd.get('contactNo'),
        address: fd.get('address'),
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('customer_id', data.customer_id);
        router.push('/homepage');
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
                Create an Account<span className="m-0 p-0 text-red">.</span>
              </h1>
              <p className="text-sm text-black mb-6 lg:text-base">
                Already have an Account?
                <Link href="/login" className="font-bold">
                  <span> Log in</span>
                </Link>
              </p>
            </div>
            <div className="Name-container flex flex-col gap-4 mb-4 lg:flex-row">
              {formFields.name.map((field) => (
                <Input
                  key={field.id}
                  label={field.label}
                  type="text"
                  placeholder={field.placeholder}
                  name={field.id}
                  id={field.id}
                  required={true}
                  containerClassName="w-full lg:w-[235px]"
                />
              ))}
            </div>
            <div className="bday-radio-container flex flex-col gap-4 mb-4 lg:flex-row">
              <div className="radio-container w-full lg:mr-8">
                <label className="text-black mb-1.5 block">
                  Sex<span className="text-red">*</span>
                </label>
                <div className="flex w-full gap-3 justify-between lg:w-fit">
                  {formFields.sex.map((field) => (
                    <RadioButtons
                      key={field.id}
                      id={field.id}
                      name="sex"
                      value={field.value}
                      label={field.label}
                    />
                  ))}
                </div>
              </div>
              <Input
                label="Birthday"
                type="date"
                name="bday"
                id="bday"
                placeholder="Birthday"
                className="text-light-gray"
                containerClassName="w-full"
                required={true}
              />
            </div>
            <div className="email-password flex flex-col gap-4 mb-4 lg:flex-row">
              {formFields.emailAndPass.map((field) => (
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
            <div className="address-phone flex flex-col gap-4 mb-4 lg:flex-row">
              {formFields.addressAndPhone.map((field) => (
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
                className="text-white bg-light-gray flex-1 lg:flex-0 hover:bg-red hover:border-red font-semibold border-2 border-light-gray px-[26px] py-2.5 rounded-[11px] cursor-pointer"
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
