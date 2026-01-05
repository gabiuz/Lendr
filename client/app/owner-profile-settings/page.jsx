"use client";

import Image from "next/image";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
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
  const [customerData, setCustomerData] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const ownerId = localStorage.getItem("owner_id");
    if (!ownerId) {
      setHasAccount(false);
      return;
    }
    setHasAccount(true);
    
    fetch(`/api/owner-profile-settings?owner_id=${ownerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile || {});
          setOriginalProfile(data.profile || {});
          setCustomerData(data.customer || null);
          if (data.profile && data.profile.business_profile_picture)
            setPreviewSrc(data.profile.business_profile_picture);
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
    setLoading(true);
    try {
      const ownerId = localStorage.getItem("owner_id");
      const payload = { owner_id: ownerId, ...profile };
      if (previewSrc && previewSrc !== profile.business_profile_picture)
        payload.business_profile_picture = previewSrc;
      
      const res = await fetch("/api/owner-profile-settings", {
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
          setPreviewSrc(data.profile.business_profile_picture || null);
        }
        alert("Profile updated successfully");
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

  async function deleteProfile() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const ownerId = localStorage.getItem("owner_id");
      const res = await fetch("/api/owner-profile-settings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner_id: ownerId }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("owner_id");
        alert("Profile deleted successfully");
        router.push("/owner-login");
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Delete error");
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
          ? { ...p, business_profile_picture: result }
          : { business_profile_picture: result }
      );
    };
    reader.readAsDataURL(f);
  }

  const formFields = {
    businessInfo: [
      { key: "business_name", label: "Business Name", placeholder: "Motorcad" },
    ],
    contactInfo: [
      {
        key: "contact_email",
        label: "Email",
        type: "email",
        placeholder: "business@gmail.com",
      },
      {
        key: "contact_number",
        label: "Phone Number",
        type: "tel",
        placeholder: "09123456789",
      },
      {
        key: "business_address",
        label: "Business Address",
        placeholder: "123 Business St",
      },
    ],
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <Navbar
        links={[
          {
            href: "/owner-homepage",
            label: "Home",
          },
          {
            href: "/browse-rentals",
            label: "Browse Rentals",
          },
          {
            href: "/owner-booking",
            label: "Bookings",
          },
          {
            href: "/owner-payments",
            label: "Payments",
          },
          {
            href: "/about-us",
            label: "About Us",
          }
        ]}
        showOwnerButton={false}
        profileInCircle={true}
      />
      {hasAccount && (
        <div className="text-black flex justify-between px-4 py-8 lg:px-36 lg:pt-36 mb-4">
          <div>
            <h1 className="text-3xl font-semibold lg:text-4xl">
              Profile Settings
            </h1>
            <p className="text-gray-600 mt-2">
              {customerData?.first_name || customerData?.last_name 
                ? `${customerData?.first_name || ''} ${customerData?.middle_name || ''} ${customerData?.last_name || ''}`.trim()
                : 'Owner Name'}
              {profile?.business_name && ` • ${profile.business_name}`}
            </p>
          </div>
          <button
            onClick={() => {
              if (!hasAccount) return;
              if (editing) {
                setProfile(originalProfile);
                setPreviewSrc(originalProfile?.business_profile_picture || null);
                setEditing(false);
              } else {
                setEditing(true);
              }
            }}
            disabled={!hasAccount}
            className={`flex justify-center items-center gap-1.5 ${
              !hasAccount ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
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
                  alt="business picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                  <p className="text-center">No Business Image</p>
                </div>
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
                  className="px-3 py-2 border rounded cursor-pointer hover:bg-gray-50"
                >
                  Upload Photo
                </button>
                {previewSrc && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewSrc(null);
                      setProfile((p) =>
                        p ? { ...p, business_profile_picture: null } : p
                      );
                    }}
                    className="px-3 py-2 border rounded hover:bg-gray-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 mt-4 lg:mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <Input
                label="Owner Name"
                placeholder="Owner Name"
                value={customerData?.first_name || customerData?.last_name
                  ? `${customerData?.first_name || ''} ${customerData?.middle_name || ''} ${customerData?.last_name || ''}`.trim()
                  : 'Owner Name'}
                readOnly={true}
                containerClassName="w-full"
              />

              <Input
                label="Business Name"
                placeholder="Business Name"
                value={profile ? profile.business_name || "" : ""}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, business_name: e.target.value } : { business_name: e.target.value }))
                }
                readOnly={!editing}
                containerClassName="w-full"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {formFields.contactInfo.map((f) => (
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
                        : { [f.key]: e.target.value }
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
                placeholder="Type your business description here..."
                value={profile ? profile.business_description || "" : ""}
                onChange={(e) =>
                  setProfile((p) =>
                    p
                      ? { ...p, business_description: e.target.value }
                      : { business_description: e.target.value }
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
                    deleteProfile();
                  }}
                  className="text-red bg-white flex-1 lg:w-48 lg:flex-0 hover:bg-red hover:text-white font-semibold border-2 border-red px-6 py-2.5 rounded-[11px]"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    saveChanges();
                  }}
                  className="text-white bg-light-gray flex-1 lg:flex-0 hover:bg-red hover:border-red font-semibold border-2 border-light-gray px-6 py-2.5 rounded-[11px]"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
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
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/owner-login")}
                className="px-6 py-3 border-2 border-light-gray rounded-lg cursor-pointer hover:text-red hover:border-red font-semibold"
              >
                Log in
              </button>
              <button
                onClick={() => router.push("/owner-register")}
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
