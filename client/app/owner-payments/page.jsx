"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Footer from "../components/Footer";

export default function OwnerPayments() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPayments();
  }, [activeFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const owner_id = localStorage.getItem("owner_id");

      if (!owner_id) {
        console.error("No owner_id found in localStorage");
        setLoading(false);
        return;
      }

      const statusParam =
        activeFilter !== "all" ? `&status=${activeFilter}` : "";
      const paymentsRes = await fetch(
        `/api/owner-payments-list?owner_id=${owner_id}${statusParam}`,
      );
      const paymentsData = await paymentsRes.json();

      console.log("Payments Response:", paymentsData);

      if (paymentsData.success) {
        // Format the payments data for display
        const formattedPayments = paymentsData.payments.map((payment) => ({
          ...payment,
          id: payment.rental_id,
          image:
            payment.product_image ||
            "/pictures/product-img-placeholder/placeholder.png",
          productName: payment.product_name,
          category: payment.category_type,
          dailyPrice: `₱${Number(payment.product_rate).toFixed(2)}`,
          customerName: `${payment.first_name} ${payment.last_name}`,
          email: payment.email,
          phone: payment.phone_number,
          city: payment.address,
          rentalStartDate: new Date(payment.start_date).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            },
          ),
          rentalEndDate: new Date(payment.end_date).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            },
          ),
          price: `₱${Number(payment.total_amount).toFixed(2)}`,
          paymentStatus: payment.payment_status,
        }));
        setPayments(formattedPayments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
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
        ]}
        showOwnerButton={false}
        profileInCircle={true}
        personalProfileHref="/homepage"
      />

      {/* Main Content */}
      <div className=" text-gray-700 px-4 md:px-8 lg:px-20 xl:px-36 py-8 md:py-12 lg:mt-24">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <span>›</span>
          <span className="text-black">Payments</span>
        </div>

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
            Payments
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage your payments, all in one place.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 transition-all text-sm md:text-base ${
              activeFilter === "all"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="bg-pink-100 p-2.5 rounded-full flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M6.2998 13.4996C6.2998 13.0018 6.70199 12.5996 7.1998 12.5996H15.2998C15.7976 12.5996 16.1998 13.0018 16.1998 13.4996C16.1998 13.9974 15.7976 14.3996 15.2998 14.3996H7.1998C6.70199 14.3996 6.2998 13.9974 6.2998 13.4996ZM8.0998 4.49961C8.0998 4.0018 8.50199 3.59961 8.9998 3.59961H15.2998C15.7976 3.59961 16.1998 4.0018 16.1998 4.49961C16.1998 4.99742 15.7976 5.39961 15.2998 5.39961H8.9998C8.50199 5.39961 8.0998 4.99742 8.0998 4.49961ZM8.0998 8.99961C8.0998 8.5018 8.50199 8.09961 8.9998 8.09961H15.2998C15.7976 8.09961 16.1998 8.5018 16.1998 8.99961C16.1998 9.49742 15.7976 9.89961 15.2998 9.89961H8.9998C8.50199 9.89961 8.0998 9.49742 8.0998 8.99961Z"
                  fill="#990000"
                />
                <path
                  d="M5.72922 3.76291C5.94297 3.45635 5.86984 3.03729 5.56328 2.82354C5.25672 2.60979 4.83766 2.68291 4.62391 2.98948L3.50735 4.57854L2.95328 4.02166C2.68891 3.7601 2.26141 3.7601 1.99703 4.02166C1.73266 4.28323 1.73547 4.71354 1.99703 4.97791L3.12203 6.10291C3.26266 6.24354 3.45953 6.31666 3.65922 6.29698C3.85891 6.27729 4.03891 6.17604 4.15422 6.01291L5.72922 3.76291ZM5.72922 8.26291C5.94297 7.95635 5.86984 7.53729 5.56328 7.32354C5.25672 7.10979 4.83766 7.18291 4.62391 7.48948L3.50735 9.07854L2.95328 8.52166C2.68891 8.25729 2.26141 8.25729 1.99985 8.52166C1.73828 8.78604 1.73547 9.21354 1.99703 9.47791L3.12203 10.6029C3.26266 10.7435 3.45953 10.8167 3.65922 10.797C3.85891 10.7773 4.03891 10.676 4.15422 10.5129L5.72922 8.26291ZM3.60016 14.6248C4.22172 14.6248 4.72516 14.1214 4.72516 13.4998C4.72516 12.8782 4.22172 12.3748 3.60016 12.3748C2.9786 12.3748 2.47516 12.8782 2.47516 13.4998C2.47516 14.1214 2.9786 14.6248 3.60016 14.6248Z"
                  fill="#990000"
                />
              </svg>
            </div>
            <span className="font-medium">All</span>
          </button>

          <button
            onClick={() => setActiveFilter("paid")}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 transition-all text-sm md:text-base ${
              activeFilter === "paid"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="bg-pink-100 p-2.5 rounded-full flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M3.2998 11.0008C3.2998 15.253 6.74762 18.7008 10.9998 18.7008C15.252 18.7008 18.6998 15.253 18.6998 11.0008C18.6998 6.74859 15.252 3.30078 10.9998 3.30078C6.74762 3.30078 3.2998 6.74859 3.2998 11.0008ZM7.31137 11.7123C7.52449 11.4992 7.87512 11.4992 8.08824 11.7123L9.83105 13.4552L13.8529 7.92766C14.0317 7.68359 14.3754 7.62859 14.6195 7.80734C14.8636 7.98609 14.9186 8.32984 14.7398 8.57391L10.3398 14.6239C10.2436 14.7545 10.0992 14.837 9.93762 14.8473C9.77605 14.8577 9.61793 14.8027 9.50449 14.6892L7.30449 12.4892C7.09137 12.2761 7.09137 11.9255 7.30449 11.7123H7.31137Z"
                  fill="#990000"
                />
                <path
                  d="M11.0002 19.7992C6.13957 19.7992 2.2002 15.8598 2.2002 10.9992C2.2002 6.13859 6.13957 2.19922 11.0002 2.19922C15.8608 2.19922 19.8002 6.13859 19.8002 10.9992C19.8002 15.8598 15.8608 19.7992 11.0002 19.7992ZM11.0002 3.29922C6.74801 3.29922 3.3002 6.74703 3.3002 10.9992C3.3002 15.2514 6.74801 18.6992 11.0002 18.6992C15.2524 18.6992 18.7002 15.2514 18.7002 10.9992C18.7002 6.74703 15.2524 3.29922 11.0002 3.29922ZM13.8568 7.92609C14.0355 7.68203 14.3793 7.62703 14.6233 7.80578C14.8674 7.98453 14.9224 8.32828 14.7436 8.57234L10.3436 14.6223C10.2474 14.753 10.103 14.8355 9.94145 14.8458C9.77988 14.8561 9.62176 14.8011 9.50832 14.6877L7.30832 12.4877C7.0952 12.2745 7.0952 11.9239 7.30832 11.7108C7.52145 11.4977 7.87207 11.4977 8.0852 11.7108L9.82801 13.4536L13.8499 7.92609H13.8568Z"
                  fill="#990000"
                />
              </svg>
            </div>
            <span className="font-medium">Paid</span>
          </button>

          <button
            onClick={() => setActiveFilter("pending")}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 transition-all text-sm md:text-base ${
              activeFilter === "pending"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="bg-pink-100 p-2.5 rounded-full flex items-center justify-center">
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M3.1499 10.5002C3.1499 8.46914 3.9735 6.63492 5.3024 5.30273L6.97912 6.97945C6.77568 7.18289 6.77568 7.51758 6.97912 7.72102L10.1291 10.871C10.3326 11.0745 10.6672 11.0745 10.8707 10.871C11.0741 10.6676 11.0741 10.3329 10.8707 10.1295L10.4999 9.75867V6.30023C10.7887 6.30023 11.0249 6.06398 11.0249 5.77523V3.16992C14.8377 3.43898 17.8499 6.61852 17.8499 10.5002C17.8499 14.5591 14.5588 17.8502 10.4999 17.8502C6.441 17.8502 3.1499 14.5591 3.1499 10.5002Z"
                  fill="#990000"
                />
                <path
                  d="M10.5001 2.09961C10.2113 2.09961 9.9751 2.33586 9.9751 2.62461V5.77461C9.9751 6.06336 10.2113 6.29961 10.5001 6.29961C10.7888 6.29961 11.0251 6.06336 11.0251 5.77461V3.1693C14.8379 3.43836 17.8501 6.61789 17.8501 10.4996C17.8501 14.5585 14.559 17.8496 10.5001 17.8496C6.44119 17.8496 3.1501 14.5585 3.1501 10.4996C3.1501 8.46852 3.97369 6.6343 5.3026 5.30211C5.50604 5.09867 5.50604 4.76398 5.3026 4.56055C5.09916 4.35711 4.76447 4.35383 4.56104 4.56055C3.04182 6.07977 2.1001 8.17977 2.1001 10.4996C2.1001 15.1393 5.86041 18.8996 10.5001 18.8996C15.1398 18.8996 18.9001 15.1393 18.9001 10.4996C18.9001 5.85992 15.1398 2.09961 10.5001 2.09961ZM7.72088 6.97883C7.51744 6.77539 7.18275 6.77539 6.97932 6.97883C6.77588 7.18227 6.77588 7.51695 6.97932 7.72039L10.1293 10.8704C10.3328 11.0738 10.6674 11.0738 10.8709 10.8704C11.0743 10.667 11.0743 10.3323 10.8709 10.1288L7.72088 6.97883Z"
                  fill="#990000"
                />
              </svg>
            </div>
            <span className="font-medium">Pending</span>
          </button>

          <button
            onClick={() => setActiveFilter("refunded")}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 transition-all text-sm md:text-base ${
              activeFilter === "refunded"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="bg-pink-100 p-2.5 rounded-full flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M2.2002 6.6C2.2002 6.49688 2.20707 6.39719 2.22082 6.2975L3.73676 7.81344C3.94988 8.02656 4.30051 8.02656 4.51363 7.81344C4.72676 7.60031 4.72676 7.24969 4.51363 7.03656L2.97707 5.5C3.24176 5.5 7.38051 5.5 15.4002 5.5C15.4002 7.32188 16.8783 8.8 18.7002 8.8V12.5366C18.9649 12.6431 19.2158 12.8047 19.4324 13.0212L19.8002 13.3891V15.4C19.8002 15.5031 19.7933 15.6028 19.7796 15.7025L18.2636 14.1866C18.0505 13.9734 17.6999 13.9734 17.4868 14.1866C17.2736 14.3997 17.2736 14.7503 17.4868 14.9634L19.0233 16.5H6.6002C6.6002 14.6781 5.12207 13.2 3.3002 13.2V9.46344C3.03551 9.35687 2.78457 9.19531 2.56801 8.97875L2.2002 8.61094V6.6ZM3.3002 14.3C4.51363 14.3 5.5002 15.2866 5.5002 16.5H4.4002C3.79176 16.5 3.3002 16.0084 3.3002 15.4V14.3ZM7.7002 11C7.7002 12.8219 9.17832 14.3 11.0002 14.3C12.8221 14.3 14.3002 12.8219 14.3002 11C14.3002 9.17813 12.8221 7.7 11.0002 7.7C9.17832 7.7 7.7002 9.17813 7.7002 11ZM16.5002 5.5H17.6002C18.2086 5.5 18.7002 5.99156 18.7002 6.6V7.7C17.4868 7.7 16.5002 6.71344 16.5002 5.5Z"
                  fill="#990000"
                />
                <path
                  d="M1.26141 5.3375C1.04828 5.12438 1.04828 4.77375 1.26141 4.56062L3.73641 2.08562C3.94953 1.8725 4.30016 1.8725 4.51328 2.08562C4.72641 2.29875 4.72641 2.64938 4.51328 2.8625L2.97672 4.39906H7.14984H7.15328H17.5998C18.8133 4.39906 19.7998 5.38562 19.7998 6.59906V13.3881L19.432 13.0203C19.2155 12.8038 18.968 12.6422 18.6998 12.5356V8.79906C16.878 8.79906 15.3998 7.32094 15.3998 5.49906H5.31078H2.97672L4.51328 7.03562C4.72641 7.24875 4.72641 7.59938 4.51328 7.8125C4.30016 8.02563 3.94953 8.02563 3.73641 7.8125L1.26141 5.3375ZM2.19984 15.3991V8.61L2.56766 8.97781C2.78422 9.19438 3.03172 9.35594 3.29984 9.4625V13.1991C5.12172 13.1991 6.59984 14.6772 6.59984 16.4991H19.023L17.4864 14.9625C17.2733 14.7494 17.2733 14.3988 17.4864 14.1856C17.6995 13.9725 18.0502 13.9725 18.2633 14.1856L20.7383 16.6606C20.9514 16.8738 20.9514 17.2244 20.7383 17.4375L18.2633 19.9125C18.0502 20.1256 17.6995 20.1256 17.4864 19.9125C17.2733 19.6994 17.2733 19.3488 17.4864 19.1356L19.023 17.5991H4.39984C3.18641 17.5991 2.19984 16.6125 2.19984 15.3991ZM3.29984 14.2991V15.3991C3.29984 16.0075 3.79141 16.4991 4.39984 16.4991H5.49984C5.49984 15.2856 4.51328 14.2991 3.29984 14.2991ZM18.6998 7.69906V6.59906C18.6998 5.99062 18.2083 5.49906 17.5998 5.49906H16.4998C16.4998 6.7125 17.4864 7.69906 18.6998 7.69906ZM13.1998 10.9991C13.1998 9.78563 12.2133 8.79906 10.9998 8.79906C9.78641 8.79906 8.79984 9.78563 8.79984 10.9991C8.79984 12.2125 9.78641 13.1991 10.9998 13.1991C12.2133 13.1991 13.1998 12.2125 13.1998 10.9991ZM7.69984 10.9991C7.69984 9.17719 9.17797 7.69906 10.9998 7.69906C12.8217 7.69906 14.2998 9.17719 14.2998 10.9991C14.2998 12.8209 12.8217 14.2991 10.9998 14.2991C9.17797 14.2991 7.69984 12.8209 7.69984 10.9991Z"
                  fill="#990000"
                />
              </svg>
            </div>
            <span className="font-medium">Refunded</span>
          </button>

          <button
            onClick={() => setActiveFilter("cancelled")}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 transition-all text-sm md:text-base ${
              activeFilter === "cancelled"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="bg-pink-100 p-2.5 rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M3.6001 11.9996C3.6001 16.6384 7.36135 20.3996 12.0001 20.3996C14.1038 20.3996 16.0276 19.6271 17.5013 18.3484L5.65135 6.49836C4.3726 7.97211 3.6001 9.89586 3.6001 11.9996ZM6.49885 5.65086L18.3488 17.5009C19.6276 16.0271 20.4001 14.1034 20.4001 11.9996C20.4001 7.36086 16.6388 3.59961 12.0001 3.59961C9.89635 3.59961 7.9726 4.37211 6.49885 5.65086Z"
                  fill="#990000"
                />
                <path
                  d="M17.5012 18.3491L5.65115 6.49914C4.3724 7.97289 3.5999 9.89664 3.5999 12.0004C3.5999 16.6391 7.36115 20.4004 11.9999 20.4004C14.1037 20.4004 16.0274 19.6279 17.5012 18.3491ZM18.3487 17.5016C19.6274 16.0279 20.3999 14.1041 20.3999 12.0004C20.3999 7.36164 16.6387 3.60039 11.9999 3.60039C9.89615 3.60039 7.9724 4.37289 6.49865 5.65164L18.3487 17.5016ZM2.3999 12.0004C2.3999 6.69789 6.6974 2.40039 11.9999 2.40039C17.3024 2.40039 21.5999 6.69789 21.5999 12.0004C21.5999 17.3029 17.3024 21.6004 11.9999 21.6004C6.6974 21.6004 2.3999 17.3029 2.3999 12.0004Z"
                  fill="#990000"
                />
              </svg>
            </div>
            <span className="font-medium">Cancelled</span>
          </button>
        </div>

        {/* Payments Table */}
        <div className="bg-white border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-100 border-b-2 border-gray-200">
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Product
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Customer Details
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Rental Period
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Amount
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 md:py-16 text-gray-400"
                    >
                      <p>Loading payments...</p>
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 md:py-16 text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-3 md:gap-4">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="md:w-16 md:h-16"
                        >
                          <path
                            d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 12C43.046 12 52 20.954 52 32C52 43.046 43.046 52 32 52C20.954 52 12 43.046 12 32C12 20.954 20.954 12 32 12ZM28 24V28H36V24H28ZM28 32V44H36V32H28Z"
                            fill="#d1d5db"
                          />
                        </svg>
                        <p className="text-base md:text-lg font-medium">
                          No payments yet
                        </p>
                        <p className="text-xs md:text-sm">
                          Your payment history will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Details */}
                      <td className="py-4 px-3 md:px-6">
                        <div className="flex items-start gap-3">
                          <Image
                            src={payment.image}
                            alt={payment.productName}
                            width={56}
                            height={56}
                            className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex flex-col gap-1 min-w-0">
                            <p className="font-semibold text-sky-800 text-xs md:text-sm truncate">
                              {payment.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: #{payment.id}
                            </p>
                            <p className="text-xs text-gray-600">
                              Category: {payment.category}
                            </p>
                            <p className="text-xs text-gray-600">
                              Daily: {payment.dailyPrice}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="py-4 px-3 md:px-6">
                        <div className="flex flex-col gap-1 text-xs md:text-sm">
                          <p className="font-semibold text-gray-900">
                            {payment.customerName}
                          </p>
                          <p className="text-gray-600 break-all">
                            {payment.email}
                          </p>
                          <p className="text-gray-600">{payment.phone}</p>
                          <p className="text-gray-600">{payment.city}</p>
                        </div>
                      </td>

                      {/* Rental Period */}
                      <td className="py-4 px-3 md:px-6">
                        <div className="flex flex-col gap-1 text-xs md:text-sm">
                          <p className="text-gray-800 font-medium">
                            {payment.rentalStartDate}
                          </p>
                          <p className="text-gray-500">to</p>
                          <p className="text-gray-800 font-medium">
                            {payment.rentalEndDate}
                          </p>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-3 md:px-6">
                        <p className="font-semibold text-gray-800 text-sm md:text-base">
                          {payment.price}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3 md:px-6">
                        <span
                          className={`inline-flex px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap ${
                            payment.paymentStatus?.toLowerCase() === "paid"
                              ? "bg-green-100 text-green-700"
                              : payment.paymentStatus?.toLowerCase() ===
                                  "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : payment.paymentStatus?.toLowerCase() ===
                                    "refunded"
                                  ? "bg-blue-100 text-blue-700"
                                  : payment.paymentStatus?.toLowerCase() ===
                                      "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {payment.paymentStatus || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
