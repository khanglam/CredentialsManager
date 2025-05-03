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
  strength: "strong" | "medium" | "weak";
  category: string;
  favorite: boolean;
  lastUpdated: string;
}

interface CredentialListProps {
  credentials?: Credential[];
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
}

const sampleCredentials: Credential[] = [
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
  credentials = sampleCredentials,
  onDelete,
  onToggleFavorite,
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
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
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
        </TabsContent>

        <TabsContent value="personal" className="mt-4">
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
        </TabsContent>

        <TabsContent value="work" className="mt-4">
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
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
