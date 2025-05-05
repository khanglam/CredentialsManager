import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/layout/Sidebar";
import TopNavigation from "../dashboard/layout/TopNavigation";
import ChangePasswordForm from "../auth/ChangePasswordForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, User } from "lucide-react";

const sidebarItems = [
  { icon: <User size={20} />, label: "Account", href: "/settings" },
  { icon: <Shield size={20} />, label: "Security", href: "/settings" },
  { icon: <Settings size={20} />, label: "Preferences", href: "/settings" },
];

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Initialize with Account as default
  const [activeItem, setActiveItem] = useState("Account");
  const [activeTab, setActiveTab] = useState("account");
  
  // Map sidebar labels to tab values
  const tabMap: Record<string, string> = {
    "Account": "account",
    "Security": "security",
    "Preferences": "preferences"
  };

  // Custom handler for sidebar item clicks
  const handleSidebarItemClick = (label: string) => {
    setActiveItem(label);
    // Map the sidebar label to the corresponding tab value
    const tabValue = tabMap[label] || 'account';
    setActiveTab(tabValue);
  };

  // Handle tab changes from the tab component
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Find the corresponding sidebar item and set it as active
    const sidebarLabel = Object.keys(tabMap).find(key => tabMap[key] === value) || 'Account';
    setActiveItem(sidebarLabel);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar
          items={sidebarItems}
          activeItem={activeItem}
          onItemClick={handleSidebarItemClick}
        />
        <main className="flex-1 overflow-auto w-full">
          <div className="container mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm sm:text-base text-gray-500">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-6 bg-gray-100 flex flex-wrap overflow-x-auto text-xs sm:text-sm">
                <TabsTrigger value="account" className="py-1 px-2 sm:py-2 sm:px-3">Account</TabsTrigger>
                <TabsTrigger value="security" className="py-1 px-2 sm:py-2 sm:px-3">Security</TabsTrigger>
                <TabsTrigger value="preferences" className="py-1 px-2 sm:py-2 sm:px-3">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>View and update your account details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-gray-700">{user.email}</p>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Button variant="destructive" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6">
                <ChangePasswordForm />
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Preference settings coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
