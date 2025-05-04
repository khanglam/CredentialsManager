import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-5xl font-semibold tracking-tight mb-1">
        Credential Manager
      </h2>
      <h3 className="text-2xl font-medium text-gray-500 mb-4">
        Store and manage your passwords securely in one place
      </h3>
      <div className="flex justify-center space-x-6">
        <Link to="/signup" className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
          Get Started
        </Link>
        <Link to="/login" className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
          Sign In
        </Link>
      </div>
    </section>
  );
}
