import { Key, Lock, ShieldCheck } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-medium mb-2">
              Secure Storage
            </h4>
            <p className="text-gray-500">
              Store all your passwords and login information in one secure location.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Key className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-xl font-medium mb-2">
              Password Generator
            </h4>
            <p className="text-gray-500">
              Create strong, unique passwords with our built-in password generator.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-xl font-medium mb-2">
              Password Strength
            </h4>
            <p className="text-gray-500">
              Visualize and improve the strength of your passwords with our strength indicator.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
