import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import CredentialManager from "./components/pages/credential-manager";
import SecurityReport from "./components/pages/security-report";
import SettingsPage from "./components/pages/settings";
import { AuthProvider, useAuth } from "../supabase/auth";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen, LoadingSpinner } from "./components/ui/loading-spinner";
import { ThemeProvider } from "./components/ui/ThemeProvider";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen text="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Navigate to="/credentials" replace />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />
        <Route
          path="/credentials"
          element={
            <PrivateRoute>
              <CredentialManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/security-report"
          element={
            <PrivateRoute>
              <SecurityReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light">
        <Suspense fallback={<LoadingScreen text="Loading application..." />}>
          <AppRoutes />
        </Suspense>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
