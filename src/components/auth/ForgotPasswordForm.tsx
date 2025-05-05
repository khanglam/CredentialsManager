import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import AuthLayout from "./AuthLayout";
import { supabase } from "../../../supabase/supabase";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset password email",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to reset your password">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto">
        {isSubmitted ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-medium text-gray-900">Check your email</h3>
            <p className="text-gray-600">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium mt-4"
            >
              Back to login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>

            <div className="text-sm text-center text-gray-600 mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
