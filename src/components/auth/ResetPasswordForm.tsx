import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import AuthLayout from "./AuthLayout";
import { supabase } from "../../../supabase/supabase";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if we have a hash in the URL (from the reset password email)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes("type=recovery")) {
      toast({
        title: "Invalid reset link",
        description: "This reset password link is invalid or has expired.",
        variant: "destructive",
      });
      // Redirect to forgot password page after a delay
      setTimeout(() => navigate("/forgot-password"), 3000);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      // Redirect to login page after a delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setError(error.message || "Failed to update password");
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Set New Password" subtitle="Create a new password for your account">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
