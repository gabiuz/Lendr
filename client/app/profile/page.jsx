"use client";

import Image from "next/image";
import Input from "../components/Input";
import RadioButtons from "../components/RadioButtons";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [hasAccount, setHasAccount] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const id = localStorage.getItem("customer_id");
    if (!id) return;
    setHasAccount(true);
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
    setLoading(true);
    try {
      const id = localStorage.getItem("customer_id");
      const payload = { customer_id: id, ...profile };
      if (previewSrc && previewSrc !== profile.user_profile_picture)
        payload.user_profile_picture = previewSrc;
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

  /**
   * Deletes the user's profile after confirmation.
   * NOTE: This requires a DELETE endpoint at /api/profile on the backend.
   * The endpoint should accept a JSON body with customer_id and return
   * { success: true/false, error?: string }
   */
  async function deleteProfile() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const id = localStorage.getItem("customer_id");
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("customer_id");
        alert("Profile deleted successfully");
        router.push("/login");
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
          ? { ...p, user_profile_picture: result }
          : { user_profile_picture: result },
      );
    };
    reader.readAsDataURL(f);
  }

  const formFields = {
    name: [
      { key: "first_name", label: "First Name", placeholder: "First Name" },
      { key: "middle_name", label: "Middle Name", placeholder: "Middle Name" },
      { key: "last_name", label: "Last Name", placeholder: "Last Name" },
    ],
    sex: [
      { id: "male", value: "male", label: "Male" },
      { id: "female", value: "female", label: "Female" },
      { id: "other", value: "other", label: "Prefer Not to Say" },
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
        placeholder: "+63",
      },
    ],
    address: [
      { key: "address", label: "Address", placeholder: "123 st. Metro Manila" },
    ],
    birthday: [{ key: "birthday", label: "Birthday", type: "date" }],
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
                // previewSrc may be a data URL
                // use regular img to support data URLs
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
                {previewSrc && (
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
                )}
              </div>
            )}
          </div>

          <div className="flex-1 mt-4 lg:mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {formFields.name.map((f) => (
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

            <div className="mt-4">
              <label className="text-black mb-1.5 block">Sex</label>
              <div className="flex gap-6 items-center">
                {formFields.sex.map((s) => (
                  <RadioButtons
                    key={s.id}
                    id={s.id}
                    name="gender"
                    value={s.value}
                    label={s.label}
                    checked={
                      !!profile &&
                      (profile.gender || "").toLowerCase() === s.value
                    }
                    onChange={() =>
                      setProfile((p) =>
                        p ? { ...p, gender: s.value } : { gender: s.value },
                      )
                    }
                    disabled={!editing}
                  />
                ))}

                {formFields.birthday.map((b) => (
                  <Input
                    key={b.key}
                    label={b.label}
                    type={b.type}
                    value={profile ? profile[b.key] || "" : ""}
                    onChange={(e) =>
                      setProfile((p) =>
                        p
                          ? { ...p, [b.key]: e.target.value }
                          : { [b.key]: e.target.value },
                      )
                    }
                    readOnly={!editing}
                    containerClassName="w-full lg:ml-6"
                  />
                ))}
              </div>
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
                label="Address"
                placeholder={formFields.address[0].placeholder}
                value={profile ? profile.address || "" : ""}
                onChange={(e) =>
                  setProfile((p) =>
                    p
                      ? { ...p, address: e.target.value }
                      : { address: e.target.value },
                  )
                }
                readOnly={!editing}
                containerClassName="w-full"
              />
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
