import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import HeroSection from "../home/HeroSection";
import FeaturesSection from "../home/FeaturesSection";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-xl">
              Credentials Manager
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/credentials">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    My Credentials
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/signup">
                <Button className="rounded-full bg-black text-white hover:bg-gray-800 text-sm px-4">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="pt-12">
        {/* Hero section */}
        <HeroSection />

        {/* Features section */}
        <FeaturesSection />
      </main>

      <footer className="bg-[#f5f5f7] py-8 mt-8">
        <div className="max-w-[980px] mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; 2025 Khang Lam</p>
        </div>
      </footer>
    </div>
  );
}

