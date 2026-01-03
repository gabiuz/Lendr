"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../components/Input";
import Checkbox from "../components/Checkbox";

export default function OwnerLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.target);
      const payload = {
        contact_email: fd.get("email"),
        password: fd.get("password"),
      };
      const res = await fetch("/api/owner-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.owner_id) {
        if (typeof window !== "undefined") localStorage.setItem("owner_id", String(data.owner_id));
        router.push("/owner-homepage");
        return;
      }
      alert(data.message || "Invalid credentials");
    } catch (err) {
      console.error(err);
      alert("Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[url('/bg-login.jpg')] bg-cover bg-center">
      <div className="flex justify-center w-full pt-6 md:w-full md:justify-center lg:w-auto lg:justify-end lg:pr-24 lg:pt-16">
        <Image src="/lendr-logo.png" alt="Lendr Logo" width={142} height={54} />
      </div>
      <div className="flex lg:justify-start lg:items-end">
        <form className="login w-full lg:w-auto" onSubmit={handleSubmit}>
          <div className="bg-white px-6 py-10 lg:px-22 lg:py-20 lg:ml-28">
            <div className="red-line mx-auto mb-8"></div>
            <div className="flex flex-col justify-center items-center lg:w-xl lg:gap-4 lg:items-start lg:mb-[88px]">
              <h1 className="text-2xl font-bold text-black mt-0 mb-1 w-fit text-center lg:text-5xl">
                Welcome, Owner<span className="m-0 p-0 text-red">.</span>
              </h1>
              <p className="text-sm text-black mb-6 lg:text-base">
                Don&apos;t have an owner account? <Link href="/owner-register" className="font-bold"> <span> Sign Up</span> </Link>
              </p>
            </div>
            <div className="email-password flex flex-col gap-4 mb-4 lg:flex-col">
              <Input label="Email" type="email" name="email" id="email" required placeholder="Abcde@gmail.com" />
              <Input label="Password" type="password" name="password" id="password" required placeholder="********" />
            </div>
            <div className="remember-me-forgot-container flex justify-between items-center mb-[45px]">
              <Checkbox id="remember-me" name="remember-me" label="Remember Me" />
              <Link href="/">
                <span className="text-light-gray hover:text-red">Forgot Password</span>
              </Link>
            </div>
            <div className="button-container flex flex-row justify-between gap-3 lg:justify-end">
              <button type="submit" disabled={loading} className="text-white bg-light-gray flex-1 lg:flex-1 hover:bg-red hover:border-red font-semibold border-2 border-light-gray px-[26px]! py-2.5! rounded-[11px]! cursor-pointer">
                {loading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
