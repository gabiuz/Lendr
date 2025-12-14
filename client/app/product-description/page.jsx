import Link from "next/link";
import Navbar from "../components/Navbar";

export default function ProductDescription() {
  return (
    <div className="bg-white h-screen">
      <Navbar />
      <div className="links">
        <Link href="/Homepage">Home</Link>
      </div>
    </div>
  );
}
