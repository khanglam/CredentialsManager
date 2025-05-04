import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Star, Trash2 } from "lucide-react";

interface Credential {
  id: number;
  name: string;
  username: string;
  password: string;
  strength: "strong" | "medium" | "weak";
  category: string;
  favorite: boolean;
  lastUpdated: string;
}

interface CredentialListProps {
  credentials?: Credential[];
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  isLoading?: boolean;
}

const sampleCredentials: Credential[] = [
  {
    id: 1,
    name: "Google",
    username: "user@example.com",
    password: "P@ssw0rd123!",
    strength: "strong",
    category: "personal",
    favorite: true,
    lastUpdated: "2023-12-15",
  },
  {
    id: 2,
    name: "GitHub",
    username: "devuser",
    password: "c0d3rP@ss",
    strength: "medium",
    category: "work",
    favorite: false,
    lastUpdated: "2024-01-20",
  },
  {
    id: 3,
    name: "AWS Console",
    username: "admin@company.com",
    password: "Cl0ud$3cure!",
    strength: "strong",
    category: "work",
    favorite: true,
    lastUpdated: "2024-02-05",
  },
  {
    id: 4,
    name: "Netflix",
    username: "family@example.com",
    password: "movies123",
    strength: "weak",
    category: "personal",
    favorite: false,
    lastUpdated: "2023-11-10",
  },
  {
    id: 5,
    name: "Bank Account",
    username: "user@example.com",
    password: "$ecur3B@nk2024",
    strength: "strong",
    category: "financial",
    favorite: true,
    lastUpdated: "2024-03-01",
  },
];

const CredentialCard = ({
  credential,
  onDelete,
  onToggleFavorite,
}: {
  credential: Credential;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "weak":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 rounded-md p-2">
              {credential.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-lg">{credential.name}</CardTitle>
              <CardDescription className="text-sm">
                {credential.username}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={
              credential.favorite ? "text-yellow-400" : "text-gray-400"
            }
            onClick={() => onToggleFavorite && onToggleFavorite(credential.id)}
          >
            <Star className={credential.favorite ? "fill-yellow-400" : ""} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {showPassword && (
          <div className="mb-3 p-2 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-500">Password:</span>
            </div>
            <div className="font-mono text-sm select-all break-all">
              {credential.password}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStrengthColor(credential.strength)}`}
              style={{
                width:
                  credential.strength === "strong"
                    ? "100%"
                    : credential.strength === "medium"
                      ? "60%"
                      : "30%",
              }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 capitalize">
            {credential.strength}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs bg-gray-50">
            {credential.category}
          </Badge>
          <span className="text-xs text-gray-500">
            Updated {credential.lastUpdated}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-3 w-3 mr-1" />
          ) : (
            <Eye className="h-3 w-3 mr-1" />
          )}
          {showPassword ? "Hide" : "View"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete && onDelete(credential.id)}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function CredentialList({
  credentials = [],
  onDelete,
  onToggleFavorite,
  isLoading = false,
}: CredentialListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCredentials = credentials.filter(
    (cred) =>
      cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search credentials..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all" disabled={isLoading}>All</TabsTrigger>
          <TabsTrigger value="personal" disabled={isLoading}>Personal</TabsTrigger>
          <TabsTrigger value="work" disabled={isLoading}>Work</TabsTrigger>
          <TabsTrigger value="financial" disabled={isLoading}>Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-10 w-10 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-4"></div>
              <p className="text-gray-500">Loading your credentials...</p>
            </div>
          ) : filteredCredentials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No credentials found</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                {searchQuery ? "No credentials match your search. Try a different query." : "Add your first credential to get started."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCredentials.map((credential) => (
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal" className="mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-10 w-10 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-4"></div>
              <p className="text-gray-500">Loading your credentials...</p>
            </div>
          ) : filteredCredentials.filter((cred) => cred.category === "personal").length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No personal credentials found</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Add your first personal credential to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCredentials
                .filter((cred) => cred.category === "personal")
                .map((credential) => (
                  <CredentialCard
                    key={credential.id}
                    credential={credential}
                    onDelete={onDelete}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="work" className="mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-10 w-10 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-4"></div>
              <p className="text-gray-500">Loading your credentials...</p>
            </div>
          ) : filteredCredentials.filter((cred) => cred.category === "work").length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No work credentials found</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Add your first work credential to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCredentials
                .filter((cred) => cred.category === "work")
                .map((credential) => (
                  <CredentialCard
                    key={credential.id}
                    credential={credential}
                    onDelete={onDelete}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-10 w-10 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-4"></div>
              <p className="text-gray-500">Loading your credentials...</p>
            </div>
          ) : filteredCredentials.filter((cred) => cred.category === "financial").length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No financial credentials found</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Add your first financial credential to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCredentials
                .filter((cred) => cred.category === "financial")
                .map((credential) => (
                  <CredentialCard
                    key={credential.id}
                    credential={credential}
                    onDelete={onDelete}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
