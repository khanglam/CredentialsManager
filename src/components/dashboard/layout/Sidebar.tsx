import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Settings,
  HelpCircle,
  Key,
  Shield,
  Lock,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
}

interface SidebarProps {
  items?: NavItem[];
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const defaultNavItems: NavItem[] = [
  { icon: <Home size={20} />, label: "Home", isActive: true, href: "/" },
  { icon: <Key size={20} />, label: "Credentials", href: "/credentials" },
  { icon: <Shield size={20} />, label: "Security Report", href: "/security-report" }
];

const defaultBottomItems: NavItem[] = [
  { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
  { icon: <HelpCircle size={20} />, label: "Help" },
];

const Sidebar = ({
  items = defaultNavItems,
  activeItem = "Home",
  onItemClick = () => { },
}: SidebarProps) => {
  const navigate = useNavigate();
  // Check if screen is mobile on initial render and when window resizes
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = React.useState(isMobile);
  const [showSidebar, setShowSidebar] = React.useState(!isMobile);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !collapsed) {
        setCollapsed(true);
        setShowSidebar(false);
      } else if (!mobile && !showSidebar) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);
  // Toggle sidebar visibility for mobile
  const toggleSidebar = () => {
    if (isMobile) {
      setShowSidebar(!showSidebar);
    } else {
      setCollapsed(!collapsed);
    }
  };

  // Allow parent components to control sidebar visibility
  React.useEffect(() => {
    // Export toggleSidebar function to window for TopNavigation to use
    // This is a simple way to communicate between components without prop drilling
    (window as any).toggleSidebar = toggleSidebar;
  }, [isMobile, showSidebar, collapsed]);

  if (!showSidebar && isMobile) {
    return null; // Don't render sidebar on mobile when hidden
  }

  return (
    <div className={`h-full bg-white/80 backdrop-blur-md border-r border-gray-200 flex flex-col transition-all duration-200 ${collapsed ? 'w-[64px]' : 'w-[280px]'
      } ${isMobile ? 'fixed z-50 shadow-lg' : ''}`}>
      <div className={`flex items-center justify-between p-6 ${collapsed ? 'px-2 py-4' : ''}`}>
        {!collapsed && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Credentials Manager
            </h2>
            <p className="text-sm text-gray-500">
              Store and manage your passwords securely
            </p>
          </div>
        )}
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={toggleSidebar}
          className="ml-auto rounded p-1 hover:bg-gray-200 transition"
        >
          <span className="sr-only">Toggle sidebar</span>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            {collapsed ? (
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            ) : (
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
            )}
          </svg>
        </button>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1.5">
          {items.map((item) => (
            <Button
              key={item.label}
              variant={"ghost"}
              className={`w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium ${item.label === activeItem ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-gray-700 hover:bg-gray-100"} ${collapsed ? 'px-2 justify-center' : ''}`}
              onClick={() => {
                onItemClick(item.label);
                if (item.href) {
                  navigate(item.href);
                }
              }}
              title={collapsed ? item.label : undefined}
            >
              <span
                className={`${item.label === activeItem ? "text-blue-600" : "text-gray-500"}`}
              >
                {item.icon}
              </span>
              {!collapsed && item.label}
            </Button>
          ))}
        </div>

        <Separator className="my-4 bg-gray-100" />

        {/* <div className="space-y-3">
          <h3 className="text-xs font-medium px-4 py-1 text-gray-500 uppercase tracking-wider">
            Categories
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            Personal
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-purple-500"></span>
            Work
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Financial
          </Button>
        </div> */}
      </ScrollArea>

      <div className="p-6 mt-auto flex flex-col items-center">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} w-full`}>
          <div className={`flex items-center ${collapsed ? 'gap-1' : 'gap-3'}`}>
            {defaultBottomItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="icon"
                className="rounded-full"
                title={collapsed ? item.label : undefined}
                onClick={() => navigate(item.href)}
              >
                <span className="text-gray-500">{item.icon}</span>
              </Button>
            ))}
          </div>
          {/* Theme toggle removed */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
