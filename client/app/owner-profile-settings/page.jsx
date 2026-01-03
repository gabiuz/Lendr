"use client";

import Image from "next/image";
import Input from "../components/Input";
import RadioButtons from "../components/RadioButtons";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function OwnerProfileSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [hasAccount, setHasAccount] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // TODO: Change to use owner_id from localStorage instead of customer_id
    const id = localStorage.getItem("customer_id");
    if (!id) return;
    setHasAccount(true);
    // TODO: Update API endpoint to fetch owner profile data
    // Should be something like /api/owner-profile or /api/profile with owner flag
    fetch(`/api/profile?customer_id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile || {});
          setOriginalProfile(data.profile || {});
          if (data.profile && data.profile.user_profile_picture)
            setPreviewSrc(data.profile.user_profile_picture);
        } else {
          setHasAccount(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setHasAccount(false);
      });
  }, []);

  async function saveChanges() {
    if (!profile) return;
    // TODO: Add validation for required business fields (business_name, email, phone_number)
    setLoading(true);
    try {
      // TODO: Change to use owner_id instead of customer_id
      const id = localStorage.getItem("customer_id");
      const payload = { customer_id: id, ...profile };
      if (previewSrc && previewSrc !== profile.user_profile_picture)
        payload.user_profile_picture = previewSrc;
      // TODO: Update API endpoint to save owner profile data
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setEditing(false);
        if (data.profile) {
          setProfile(data.profile);
          setOriginalProfile(data.profile);
          setPreviewSrc(data.profile.user_profile_picture || null);
        }
        // TODO: Replace alert with toast notification
        alert("Profile updated");
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Update error");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setPreviewSrc(result);
      setProfile((p) =>
        p
          ? { ...p, user_profile_picture: result }
          : { user_profile_picture: result },
      );
    };
    reader.readAsDataURL(f);
  }

  // TODO: Verify these field keys match the database schema for owner profiles
  // May need to use different keys like owner_business_name, owner_name, etc.
  const formFields = {
    businessInfo: [
      { key: "business_name", label: "Business Name", placeholder: "Motorcad" },
      { key: "name", label: "Name", placeholder: "Jadia" },
    ],
    emailAndPhone: [
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "Abcde@gmail.com",
      },
      {
        key: "phone_number",
        label: "Phone Number",
        type: "tel",
        placeholder: "09123456789",
      },
    ],
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <Navbar />
      {hasAccount && (
        <div className="text-black flex justify-between px-4 py-8 lg:px-36 lg:pt-36">
          <h1 className="text-3xl font-semibold lg:text-4xl">
            Profile Settings
          </h1>
          <button
            onClick={() => {
              if (!hasAccount) return;
              if (editing) {
                setProfile(originalProfile);
                setPreviewSrc(originalProfile?.user_profile_picture || null);
                setEditing(false);
              } else {
                setEditing(true);
              }
            }}
            disabled={!hasAccount}
            className={`flex justify-center items-center gap-1.5 ${!hasAccount ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <p>{editing ? "Cancel" : "Edit Profile"}</p>
          </button>
        </div>
      )}

      {hasAccount ? (
        <div className="flex flex-col lg:flex-row lg:gap-8 lg:px-36 px-4">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="rounded-4xl w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 overflow-hidden bg-gray-100">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="profile photo"
                  className="w-full h-full object-cover"
                />
              ) : profile && profile.user_profile_picture ? (
                <img
                  src={profile.user_profile_picture}
                  alt="profile photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>

            {editing && (
              <div className="flex gap-3">
                <input
                  ref={fileInputRef}
                  id="profileFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="px-3 py-2 border rounded cursor-pointer"
                >
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewSrc(null);
                    setProfile((p) =>
                      p ? { ...p, user_profile_picture: null } : p,
                    );
                  }}
                  className="px-3 py-2 border rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 mt-4 lg:mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {formFields.businessInfo.map((f) => (
                <Input
                  key={f.key}
                  label={f.label}
                  placeholder={f.placeholder}
                  value={profile ? profile[f.key] || "" : ""}
                  onChange={(e) =>
                    setProfile((p) =>
                      p
                        ? { ...p, [f.key]: e.target.value }
                        : { [f.key]: e.target.value },
                    )
                  }
                  readOnly={!editing}
                  containerClassName="w-full"
                />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {formFields.emailAndPhone.map((f) => (
                <Input
                  key={f.key}
                  label={f.label}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={profile ? profile[f.key] || "" : ""}
                  onChange={(e) =>
                    setProfile((p) =>
                      p
                        ? { ...p, [f.key]: e.target.value }
                        : { [f.key]: e.target.value },
                    )
                  }
                  readOnly={!editing}
                  containerClassName="w-full"
                />
              ))}
            </div>

            <div className="mt-4">
              <Input
                label="Business Description"
                placeholder="Type your product description here..."
                value={profile ? profile.business_description || "" : ""}
                onChange={(e) =>
                  setProfile((p) =>
                    p
                      ? { ...p, business_description: e.target.value }
                      : { business_description: e.target.value },
                  )
                }
                readOnly={!editing}
                containerClassName="w-full"
              />
            </div>

            <div className="mt-4">
              <label className="text-black mb-1.5 block">Bank Details</label>
              {/* TODO: Make bank details interactive - allow adding/removing payment methods */}
              {/* TODO: Store bank details in profile state and save to database */}
              {/* TODO: Add modal or collapsible section to input actual bank account numbers */}
              {/* Current implementation is static - needs to be dynamic */}
              <div className="flex gap-3">
                <div className="px-4 py-2 border rounded-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    G
                  </div>
                  <span>GCash</span>
                </div>
                <div className="px-4 py-2 border rounded-lg flex items-center gap-2">
                  <span className="font-bold text-blue-700">VISA</span>
                </div>
              </div>
            </div>

            {editing && (
              <div className="button-container flex flex-col justify-end gap-3 px-0 pb-6 mt-6 lg:flex-row lg:justify-end lg:items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    saveChanges();
                  }}
                  className="text-white bg-light-gray flex-1 lg:flex-0 hover:bg-red hover:border-red font-semibold border-2 border-light-gray px-6 py-2.5 rounded-[11px]"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full px-4 lg:px-36 pt-12 lg:pt-36">
          <div className="border rounded-lg p-8 bg-white shadow-sm text-center max-w-md mx-auto">
            <h2 className="text-2xl text-black font-semibold mb-4">
              No Account Found
            </h2>
            <p className="mb-6 text-gray-600">
              You are not logged in. Please log in or create an account to view
              and edit your profile.
            </p>
            {/* TODO: Update these routes to redirect to owner-specific login/registration */}
            {/* May need /owner-login and /owner-register routes */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-3 border-2 border-light-gray rounded-lg cursor-pointer hover:text-red hover:border-red font-semibold"
              >
                Log in
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-6 py-3 bg-light-gray text-white rounded-lg cursor-pointer hover:bg-red font-semibold"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
