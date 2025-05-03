import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-5xl font-semibold tracking-tight mb-1">
        Secure Credential Manager
      </h2>
      <h3 className="text-2xl font-medium text-gray-500 mb-4">
        Store, manage, and track sensitive login information with military-grade
        encryption
      </h3>
      <div className="flex justify-center space-x-6 text-xl text-blue-600">
        <Link to="/" className="flex items-center hover:underline">
          Learn more <ChevronRight className="h-4 w-4" />
        </Link>
        <Link to="/signup" className="flex items-center hover:underline">
          Get started <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
