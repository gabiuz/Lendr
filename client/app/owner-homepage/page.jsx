"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { startRentalStatusScheduler } from "@/source/rentalStatusScheduler";

export default function OwnerDashboard() {
  const router = useRouter();
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [rentals, setRentals] = useState([]);

  const tips = [
    "Listing with clear photos and detailed descriptions get 3x more bookings!",
    "Adding multiple angles of your item builds renter trust instantly!",
    "Verified owners receeive more booking requests than unverified ones.",
    "Responding withing 10 minutes increases your approval rate by 40%!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [tips.length]);

  // Initialize rental status scheduler on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      startRentalStatusScheduler();
    }
  }, []);

  const [stats, setStats] = useState({ products: 0, activeRentals: 0, totalEarnings: 0, avgRating: null });

  useEffect(() => {
    const ownerId = typeof window !== 'undefined' ? localStorage.getItem('owner_id') : null;
    if (!ownerId) return;

    async function loadStats() {
      try {
        const res = await fetch(`/api/owner-stats?owner_id=${encodeURIComponent(ownerId)}`);
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load owner stats', err);
      }
    }

    async function loadRentals() {
      try {
        const res = await fetch(`/api/owner-rentals?owner_id=${encodeURIComponent(ownerId)}`);
        const data = await res.json();
        if (data.success) {
          setRentals(data.rentals);
        }
      } catch (err) {
        console.error('Failed to load rentals', err);
      }
    }

    // Load data immediately
    loadStats();
    loadRentals();

    // Set up interval to refresh data every 30 seconds to reflect real-time updates
    const statsInterval = setInterval(loadStats, 30000);
    const rentalsInterval = setInterval(loadRentals, 30000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(rentalsInterval);
    };
  }, []);
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
          {
            href: "/about-us",
            label: "About Us",
          }
        ]}
        showOwnerButton={false}
        profileInCircle={true}
        personalProfileHref="/homepage"
      />
      {/* image hero section */}
      <header className="bg-[url('/owner-dashboard-image.jpg')] bg-cover bg-center h-[500px] md:h-[600px] xl:h-[766px]">
        <div className="flex flex-col items-center justify-center gap-9 md:gap-6 text-center px-4 h-full">
          <h1 className="text-white font-bold text-3xl md:text-4xl xl:text-7xl">
            Turn Your Items Into <span className="text-red">Income</span>
          </h1>
          <p className="text-white font-medium text-sm md:text-base xl:text-xl max-w-2xl">
            List your unused items and start earning safely and conveniently.
          </p>
          <button onClick={() => router.push('/add-products')} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full cursor-pointer text-sm md:text-base xl:text-lg transition-colors whitespace-nowrap">
            {stats && stats.products > 0 ? '+ Add product' : '+ Add your first product'}
          </button>
        </div>
      </header>
      <div className="overview-container mt-20 px-4 md:px-8 lg:px-20 xl:px-36 mb-20">
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center">
            Overview
          </h2>
          {/* Overview Cards */}
          <div className="overview-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Products Card */}
            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="">
                <svg width="190" height="170" viewBox="0 0 190 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M19 59.5V119C19 123.702 23.2453 127.5 28.5 127.5H52.25V93.5C52.25 77.0578 67.1234 63.75 85.5 63.75H133V59.5C133 54.7984 128.755 51 123.5 51H28.5C23.2453 51 19 54.7984 19 59.5Z" fill="#990000"/>
                  <path d="M57 34V42.5H95V34C95 24.6234 86.4797 17 76 17C65.5203 17 57 24.6234 57 34ZM47.5 42.5V34C47.5 19.9219 60.2656 8.5 76 8.5C91.7344 8.5 104.5 19.9219 104.5 34V42.5H123.5C133.98 42.5 142.5 50.1234 142.5 59.5V63.75H133V59.5C133 54.7984 128.755 51 123.5 51H28.5C23.2453 51 19 54.7984 19 59.5V119C19 123.702 23.2453 127.5 28.5 127.5H52.25V136H28.5C18.0203 136 9.5 128.377 9.5 119V59.5C9.5 50.1234 18.0203 42.5 28.5 42.5H47.5ZM76 93.5V136C76 140.702 80.2453 144.5 85.5 144.5H161.5C166.755 144.5 171 140.702 171 136V93.5C171 88.7984 166.755 85 161.5 85H85.5C80.2453 85 76 88.7984 76 93.5ZM66.5 93.5C66.5 84.1234 75.0203 76.5 85.5 76.5H161.5C171.98 76.5 180.5 84.1234 180.5 93.5V136C180.5 145.377 171.98 153 161.5 153H85.5C75.0203 153 66.5 145.377 66.5 136V93.5ZM99.75 97.75C102.363 97.75 104.5 99.6625 104.5 102V106.25C104.5 115.627 113.02 123.25 123.5 123.25C133.98 123.25 142.5 115.627 142.5 106.25V102C142.5 99.6625 144.637 97.75 147.25 97.75C149.863 97.75 152 99.6625 152 102V106.25C152 120.328 139.234 131.75 123.5 131.75C107.766 131.75 95 120.328 95 106.25V102C95 99.6625 97.1375 97.75 99.75 97.75Z" fill="#990000"/>
                </svg>
              </div>
              <div className="flex flex-col items-center gap-2.5">
                <h3 className="text-3xl font-bold text-black">{stats.products}</h3>
                <p className="text-gray-600 font-medium">Products</p>
              </div>
            </div>

            {/* Active Rentals Card */}
            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="">
                <svg width="170" height="170" viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M27.3594 68H142.614L130.369 129.173C129.572 133.158 126.092 136 122.028 136H47.8922C43.8281 136 40.3484 133.131 39.5516 129.173L27.3594 68ZM51 89.25V114.75C51 117.087 52.9125 119 55.25 119C57.5875 119 59.5 117.087 59.5 114.75V89.25C59.5 86.9125 57.5875 85 55.25 85C52.9125 85 51 86.9125 51 89.25ZM80.75 89.25V114.75C80.75 117.087 82.6625 119 85 119C87.3375 119 89.25 117.087 89.25 114.75V89.25C89.25 86.9125 87.3375 85 85 85C82.6625 85 80.75 86.9125 80.75 89.25ZM110.5 89.25V114.75C110.5 117.087 112.412 119 114.75 119C117.088 119 119 117.087 119 114.75V89.25C119 86.9125 117.088 85 114.75 85C112.412 85 110.5 86.9125 110.5 89.25Z" fill="#990000"/>
                  <path d="M85 17C86.2219 17 87.3641 17.5047 88.1609 18.4078L124.923 59.5H153C155.337 59.5 157.25 61.4125 157.25 63.75C157.25 66.0875 155.337 68 153 68H151.3L138.736 130.847C137.142 138.789 130.183 144.5 122.055 144.5H47.9187C39.8172 144.5 32.8312 138.789 31.2375 130.847L18.7 68H17C14.6625 68 12.75 66.0875 12.75 63.75C12.75 61.4125 14.6625 59.5 17 59.5H45.0766L81.8391 18.4078C82.6359 17.5047 83.8047 17 85 17ZM85 27.625L56.4719 59.5H113.528L85 27.625ZM27.3594 68L39.6047 129.173C40.4016 133.158 43.8813 136 47.9453 136H122.081C126.145 136 129.625 133.131 130.422 129.173L142.641 68H27.3594ZM59.5 89.25V114.75C59.5 117.088 57.5875 119 55.25 119C52.9125 119 51 117.088 51 114.75V89.25C51 86.9125 52.9125 85 55.25 85C57.5875 85 59.5 86.9125 59.5 89.25ZM85 85C87.3375 85 89.25 86.9125 89.25 89.25V114.75C89.25 117.088 87.3375 119 85 119C82.6625 119 80.75 117.088 80.75 114.75V89.25C80.75 86.9125 82.6625 85 85 85ZM119 89.25V114.75C119 117.088 117.088 119 114.75 119C112.412 119 110.5 117.088 110.5 114.75V89.25C110.5 86.9125 112.412 85 114.75 85C117.088 85 119 86.9125 119 89.25Z" fill="#990000"/>
                </svg>
              </div>
              <div className="flex flex-col items-center gap-2.5">
                <h3 className="text-3xl font-bold text-black">{stats.activeRentals}</h3>
                <p className="text-gray-600 font-medium">Active Rentals</p>
              </div>
            </div>

            {/* Total Earnings Card */}
            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="">
                <svg width="162" height="162" viewBox="0 0 162 162" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M24.3 68.8498C24.3 69.4573 24.6291 70.5711 26.4009 72.0898C28.1475 73.5832 30.9066 75.1273 34.7034 76.4942C42.2212 79.2279 52.8525 80.9998 64.8253 80.9998C76.7981 80.9998 87.4294 79.2279 94.9472 76.4942C98.7187 75.1273 101.478 73.5832 103.25 72.0898C105.022 70.5711 105.351 69.4573 105.351 68.8498C105.351 68.2423 105.022 67.1286 103.25 65.6098C101.503 64.1164 98.7441 62.5723 94.9472 61.2054C87.4294 58.4717 76.7981 56.6998 64.8253 56.6998C52.8525 56.6998 42.2212 58.4717 34.7034 61.2054C30.9319 62.5723 28.1728 64.1164 26.4009 65.6098C24.6291 67.1286 24.3 68.2423 24.3 68.8498ZM24.3 80.5189V95.1748C24.3 95.9595 24.705 97.1998 26.4516 98.7692C28.1981 100.339 30.9572 101.959 34.7287 103.376C42.2465 106.236 52.8525 108.084 64.8 108.084C76.7475 108.084 87.3534 106.236 94.8712 103.376C98.6428 101.933 101.402 100.339 103.148 98.7692C104.895 97.1998 105.3 95.9595 105.3 95.1748V80.5189C103.072 81.8857 100.491 83.0754 97.6809 84.0879C89.0747 87.2267 77.4309 89.0745 64.8 89.0745C52.1691 89.0745 40.5253 87.2267 31.9191 84.0879C29.1094 83.0754 26.5275 81.8857 24.3 80.5189ZM24.3 107.249V124.006C24.3 124.79 24.705 126.031 26.4516 127.6C28.1981 129.17 30.9572 130.789 34.7287 132.207C42.2465 135.067 52.8525 136.94 64.8 136.94C76.7475 136.94 87.3534 135.093 94.8712 132.232C98.6428 130.79 101.402 129.195 103.148 127.625C104.895 126.056 105.3 124.79 105.3 124.006V107.249C103.098 108.666 100.541 109.907 97.7316 110.97C89.1 114.26 77.4562 116.209 64.8 116.209C52.1437 116.209 40.4747 114.26 31.8684 110.97C29.0841 109.907 26.5275 108.666 24.3 107.249ZM56.7 36.4498C56.7 36.5257 56.7 36.6017 56.7253 36.7029C59.3831 36.5257 62.0916 36.4498 64.8 36.4498C78.1903 36.4498 91.0997 38.4748 101.351 42.3982C104.844 43.7398 108.464 45.4357 111.831 47.6886C117.779 46.9039 123.044 45.6636 127.322 44.1195C131.093 42.7526 133.852 41.2086 135.624 39.7151C137.396 38.1964 137.725 37.0826 137.725 36.4751C137.725 35.8676 137.396 34.7539 135.624 33.2351C133.852 31.7164 131.093 30.1723 127.322 28.8054C119.804 26.0717 109.147 24.2998 97.2 24.2998C85.2525 24.2998 74.5959 26.0717 67.0781 28.8054C63.3066 30.1723 60.5475 31.7164 58.7756 33.2098C57.0037 34.7286 56.6747 35.8423 56.6747 36.4498H56.7ZM119.576 54.5989C122.791 58.5729 125.55 64.0151 125.55 70.8748V71.6089C126.132 71.4064 126.714 71.2039 127.271 71.0014C131.043 69.5586 133.802 67.9639 135.548 66.3945C137.295 64.8251 137.7 63.5595 137.7 62.7748V48.1189C135.472 49.4857 132.891 50.6754 130.081 51.6879C126.942 52.827 123.398 53.7889 119.576 54.5736V54.5989ZM125.55 80.0886V100.414C126.132 100.212 126.714 100.009 127.271 99.807C131.043 98.3642 133.802 96.7695 135.548 95.2001C137.295 93.6307 137.7 92.3904 137.7 91.6057V74.8489C135.498 76.2664 132.941 77.5067 130.132 78.5698C128.689 79.1267 127.145 79.6329 125.55 80.1139V80.0886Z" fill="#990000"/>
                  <path d="M56.7 36.4503C56.7 36.5262 56.7 36.6021 56.7253 36.7034C53.9663 36.8806 51.2578 37.1337 48.6 37.4881V36.4503C48.6 32.5775 50.7769 29.4387 53.5106 27.0846C56.2697 24.7053 60.016 22.7562 64.3191 21.2121C72.9253 18.0734 84.5691 16.2256 97.2 16.2256C109.831 16.2256 121.475 18.0734 130.081 21.2121C134.359 22.7815 138.13 24.7306 140.889 27.0846C143.648 29.4387 145.8 32.6028 145.8 36.4503V91.6062C145.8 95.5043 143.724 98.7443 140.965 101.225C138.206 103.706 134.46 105.756 130.157 107.401C128.714 107.958 127.17 108.464 125.575 108.945V100.44C126.158 100.238 126.74 100.035 127.297 99.8328C131.068 98.39 133.827 96.7953 135.574 95.2259C137.32 93.6565 137.7 92.3909 137.7 91.6062V74.8493C135.498 76.2668 132.941 77.5071 130.132 78.5703C128.689 79.1271 127.145 79.6334 125.55 80.1143V71.6093C126.132 71.4068 126.714 71.2043 127.271 71.0018C131.043 69.559 133.802 67.9643 135.548 66.395C137.295 64.8256 137.7 63.56 137.7 62.7753V48.1193C135.473 49.4862 132.891 50.6759 130.081 51.6884C126.942 52.8275 123.398 53.7893 119.576 54.574C118.463 53.2071 117.298 52.0175 116.184 51.005C114.818 49.7646 113.349 48.6509 111.831 47.6384C117.779 46.8537 123.044 45.6134 127.322 44.0693C131.093 42.7025 133.853 41.1584 135.624 39.665C137.396 38.1462 137.725 37.0325 137.725 36.425C137.725 35.8175 137.396 34.7037 135.624 33.185C133.853 31.7168 131.093 30.1728 127.322 28.8059C119.804 26.0721 109.148 24.3003 97.2 24.3003C85.2525 24.3003 74.596 26.0721 67.0781 28.8059C63.3066 30.1728 60.5475 31.7168 58.7756 33.2103C57.0038 34.729 56.6747 35.8428 56.6747 36.4503H56.7ZM24.3 68.8503C24.3 69.4578 24.6291 70.5715 26.401 72.0903C28.1475 73.5837 30.9066 75.1278 34.7035 76.4946C42.2213 79.2284 52.8525 81.0003 64.8253 81.0003C76.7981 81.0003 87.4294 79.2284 94.9472 76.4946C98.7188 75.1278 101.478 73.5837 103.25 72.0903C105.022 70.5715 105.351 69.4578 105.351 68.8503C105.351 68.2428 105.022 67.129 103.25 65.6103C101.503 64.1168 98.7441 62.5728 94.9472 61.2059C87.4294 58.4721 76.7981 56.7003 64.8253 56.7003C52.8525 56.7003 42.2213 58.4721 34.7035 61.2059C30.9319 62.5728 28.1728 64.1168 26.401 65.6103C24.6291 67.129 24.3 68.2428 24.3 68.8503ZM16.2 68.8503C16.2 64.9775 18.3769 61.8387 21.1106 59.4846C23.8697 57.1053 27.6159 55.1562 31.9191 53.6121C40.5253 50.4734 52.1691 48.6256 64.8 48.6256C77.431 48.6256 89.0747 50.4734 97.681 53.6121C101.959 55.1815 105.73 57.1306 108.489 59.4846C111.248 61.8387 113.4 65.0028 113.4 68.8503V124.006C113.4 127.904 111.324 131.144 108.565 133.625C105.806 136.106 102.06 138.156 97.7569 139.801C89.1253 143.092 77.4563 145.041 64.8 145.041C52.1438 145.041 40.4747 143.092 31.8685 139.801C27.5653 138.156 23.8191 136.106 21.06 133.625C18.3009 131.144 16.2 127.904 16.2 124.006V68.8503ZM105.3 80.5193C103.073 81.8862 100.491 83.0759 97.681 84.0884C89.0747 87.2271 77.431 89.075 64.8 89.075C52.1691 89.075 40.5253 87.2271 31.9191 84.0884C29.1094 83.0759 26.5275 81.8862 24.3 80.5193V95.1753C24.3 95.96 24.705 97.2003 26.4516 98.7696C28.1981 100.339 30.9572 101.959 34.7288 103.377C42.2466 106.237 52.8525 108.085 64.8 108.085C76.7475 108.085 87.3534 106.237 94.8713 103.377C98.6428 101.934 101.402 100.339 103.148 98.7696C104.895 97.2003 105.3 95.96 105.3 95.1753V80.5193ZM24.3 124.006C24.3 124.791 24.705 126.031 26.4516 127.601C28.1981 129.17 30.9572 130.79 34.7288 132.207C42.2466 135.068 52.8525 136.941 64.8 136.941C76.7475 136.941 87.3534 135.093 94.8713 132.233C98.6428 130.79 101.402 129.195 103.148 127.626C104.895 126.057 105.3 124.791 105.3 124.006V107.249C103.098 108.667 100.541 109.907 97.7316 110.97C89.1 114.261 77.4563 116.21 64.8 116.21C52.1438 116.21 40.4747 114.261 31.8685 110.97C29.0841 109.907 26.5275 108.667 24.3 107.249V124.006Z" fill="#990000"/>
                </svg>
              </div>
              <div className="flex flex-col items-center gap-2.5">
                <h3 className="text-3xl font-bold text-black">{typeof stats.totalEarnings === 'number' ? `₱${Number(stats.totalEarnings).toLocaleString()}` : '₱0'}</h3>
                <p className="text-gray-600 font-medium">Total Earnings</p>
              </div>
            </div>

            {/* Rating Card */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="">
                <svg width="170" height="170" viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M22.764 64.7857L50.2297 92.2514C52.1422 94.1639 53.0453 96.8998 52.6203 99.5826L46.5375 137.939L81.175 120.328C83.5922 119.106 86.4609 119.106 88.8781 120.328L123.489 137.939L117.433 99.5826C117.008 96.8998 117.884 94.1639 119.823 92.2514L147.262 64.7592L108.906 58.6498C106.223 58.2248 103.912 56.5514 102.664 54.1076L85.0265 19.5498L67.3625 54.1342C66.1406 56.5514 63.8031 58.2514 61.1203 58.6764L22.764 64.7857Z" fill="#FFBB00"/>
                  <path d="M110.234 50.2828L90.7109 11.9797C89.6219 9.85469 87.4172 8.5 85.0266 8.5C82.6359 8.5 80.4313 9.85469 79.3422 11.9797L59.7922 50.2828L17.3188 57.0297C14.9547 57.4016 12.9891 59.075 12.2453 61.3594C11.5016 63.6437 12.1125 66.1406 13.7859 67.8406L44.1734 98.2547L37.4797 140.728C37.1078 143.092 38.0906 145.483 40.0297 146.891C41.9688 148.298 44.5188 148.511 46.6703 147.422L85.0266 127.925L123.356 147.422C125.481 148.511 128.058 148.298 129.997 146.891C131.936 145.483 132.919 143.119 132.547 140.728L125.827 98.2547L156.214 67.8406C157.914 66.1406 158.498 63.6437 157.755 61.3594C157.011 59.075 155.072 57.4016 152.681 57.0297L110.234 50.2828ZM108.906 58.6766L147.263 64.7859L119.823 92.2781C117.911 94.1906 117.008 96.9266 117.433 99.6094L123.489 137.939L88.8781 120.328C86.4609 119.106 83.5922 119.106 81.175 120.328L46.5375 137.939L52.5938 99.5828C53.0188 96.9 52.1422 94.1641 50.2031 92.2516L22.7641 64.7594L61.1203 58.65C63.8031 58.225 66.1141 56.5516 67.3625 54.1078L85.0266 19.55L102.664 54.1344C103.886 56.5516 106.223 58.2516 108.906 58.6766Z" fill="#FFBB00"/>
                </svg>
              </div>
              <div className="flex flex-col items-center gap-2.5">
                <h3 className="text-3xl font-bold text-black">{stats.avgRating !== null ? stats.avgRating : '—'}</h3>
                <p className="text-gray-600 font-medium">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rentals-container">
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center">
            My Rentals
          </h2>
        </div>
        <div className="rentals-card px-4 md:px-8 lg:px-20 xl:px-36 mb-20 xl:mt-16">
          <div className="flex flex-col shadow-lg rounded-2xl overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-neutral-200">
                  <th className="text-center py-4 px-4 font-bold text-black">
                    Products
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-black">
                    Customer
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-black">
                    Dates
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-black">
                    Total
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-black">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {rentals.length > 0 ? (
                  rentals.map((rental) => (
                    <tr key={rental.rental_id} className="border-b border-gray-200 hover:bg-gray-200 transition-colors">
                      <td className="py-4 px-4 text-center text-sky-800">{rental.product_name}</td>
                      <td className="py-4 px-4 text-center text-gray-800">{rental.first_name} {rental.last_name}</td>
                      <td className="py-4 px-4 text-center text-gray-800">
                        {new Date(rental.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(rental.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-4 text-center text-gray-800">₱{Number(rental.total_amount).toLocaleString()}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rental.status === 'Ongoing' ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {rental.status === 'To ship' ? 'Pending' : rental.status === 'Shipped' ? 'Ongoing' : rental.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 px-4 text-center text-gray-600">
                      No ongoing rentals at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className=" bg-zinc-800 view-rentals-btn w-full flex justify-center mt-4 hover:bg-zinc-700 transition-colors">
              <button onClick={() => router.push("/owner-booking")} className="text-white font-bold px-6 py-3 rounded-lg ">
                View all rentals
              </button>
            </div>
          </div>
        </div>
      <div className="info-card-container flex flex-col lg:flex-row bg-zinc-800 justify-start items-center gap-6 md:gap-8 lg:gap-20 xl:gap-36 px-4 md:px-8 lg:px-20 xl:px-36 py-10 md:py-12 lg:py-14">
        <div className="text text-white text-center lg:text-left">
          <h1 className="max-w-xs md:max-w-md lg:max-w-lg text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">Tips & Insights</h1>
        </div>
        <div className="tips-section flex flex-col justify-center items-center gap-3 md:gap-4 w-full lg:w-auto">
          <p className="text-white font-semibold text-xs md:text-sm lg:text-base xl:text-2xl min-h-8 md:min-h-10 lg:min-h-12 transition-opacity duration-500">
            {tips[activeTipIndex]}
          </p>
          <div className="tips-list flex flex-row gap-2 md:gap-3 lg:gap-4 items-center">
            {tips.map((tip, index) => (
              <div
                key={index}
                className={`h-2 md:h-2.5 lg:h-3 rounded-full transition-all duration-500 ease-in-out ${
                  index === activeTipIndex
                    ? 'bg-red-600 w-24 md:w-32 lg:w-40 xl:w-48'
                    : 'bg-gray-400 w-16 md:w-20 lg:w-28 xl:w-34'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

