import { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import CredentialList from "../credential/CredentialList";
import AddCredentialDialog from "../credential/AddCredentialDialog";
import { Key, Star, Shield, Lock } from "lucide-react";

interface Credential {
  id: number;
  name: string;
  username: string;
  strength: "strong" | "medium" | "weak";
  category: string;
  favorite: boolean;
  lastUpdated: string;
}

const sidebarItems = [
  { icon: <Key size={20} />, label: "All Credentials", isActive: true },
  { icon: <Star size={20} />, label: "Favorites" },
  { icon: <Shield size={20} />, label: "Security Report" },
  { icon: <Lock size={20} />, label: "Password Generator" },
];

const initialCredentials: Credential[] = [
  {
    id: 1,
    name: "Google",
    username: "user@example.com",
    strength: "strong",
    category: "personal",
    favorite: true,
    lastUpdated: "2023-12-15",
  },
  {
    id: 2,
    name: "GitHub",
    username: "devuser",
    strength: "medium",
    category: "work",
    favorite: false,
    lastUpdated: "2024-01-20",
  },
  {
    id: 3,
    name: "AWS Console",
    username: "admin@company.com",
    strength: "strong",
    category: "work",
    favorite: true,
    lastUpdated: "2024-02-05",
  },
  {
    id: 4,
    name: "Netflix",
    username: "family@example.com",
    strength: "weak",
    category: "personal",
    favorite: false,
    lastUpdated: "2023-11-10",
  },
  {
    id: 5,
    name: "Bank Account",
    username: "user@example.com",
    strength: "strong",
    category: "financial",
    favorite: true,
    lastUpdated: "2024-03-01",
  },
];

export default function CredentialManager() {
  const [credentials, setCredentials] =
    useState<Credential[]>(initialCredentials);
  const [activeItem, setActiveItem] = useState("All Credentials");

  const handleDelete = (id: number) => {
    setCredentials(credentials.filter((cred) => cred.id !== id));
  };

  const handleToggleFavorite = (id: number) => {
    setCredentials(
      credentials.map((cred) =>
        cred.id === id ? { ...cred, favorite: !cred.favorite } : cred,
      ),
    );
  };

  const handleAddCredential = (newCred: {
    name: string;
    username: string;
    password: string;
    category: string;
  }) => {
    const newCredential: Credential = {
      id: Math.max(...credentials.map((c) => c.id)) + 1,
      name: newCred.name,
      username: newCred.username,
      strength: "strong", // In a real app, calculate strength based on password
      category: newCred.category,
      favorite: false,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setCredentials([...credentials, newCredential]);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar
          items={sidebarItems}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Credential Vault
                </h1>
                <p className="text-gray-500">
                  Securely manage all your passwords
                </p>
              </div>
              <AddCredentialDialog onSave={handleAddCredential} />
            </div>

            <CredentialList
              credentials={credentials}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
