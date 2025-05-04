import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="ml-3 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="ml-2">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </Button>
  );
}
