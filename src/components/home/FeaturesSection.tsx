import { ChevronRight, Lock, Shield, Key } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-[#f5f5f7] text-center">
      <h2 className="text-5xl font-semibold tracking-tight mb-1">
        Military-Grade Security
      </h2>
      <h3 className="text-2xl font-medium text-gray-500 mb-4">
        Protecting your credentials with advanced encryption
      </h3>
      <div className="flex justify-center space-x-6 text-xl text-blue-600">
        <Link to="/" className="flex items-center hover:underline">
          Security features <ChevronRight className="h-4 w-4" />
        </Link>
        <Link to="/" className="flex items-center hover:underline">
          How it works <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-8 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h4 className="text-xl font-medium mb-2">
            Zero-Knowledge Encryption
          </h4>
          <p className="text-gray-500">
            AES-256 encryption ensures your data remains secure and private at
            all times.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="text-xl font-medium mb-2">
            Multi-Factor Authentication
          </h4>
          <p className="text-gray-500">
            Add an extra layer of security with TOTP via authenticator apps.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Key className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="text-xl font-medium mb-2">Password Health</h4>
          <p className="text-gray-500">
            Monitor password strength, identify reused passwords, and get
            security recommendations.
          </p>
        </div>
      </div>
    </section>
  );
}
