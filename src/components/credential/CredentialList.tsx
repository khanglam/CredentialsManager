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
import { Eye, EyeOff, Star, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import EditCredentialDialog from "./EditCredentialDialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Credential {
  id: number;
  name: string;
  username: string;
  password: string;
  strength: "strong" | "medium" | "weak";
  category: string;
  favorite: boolean;
  lastUpdated: string;
  notes?: string;
}

interface CredentialListProps {
  credentials?: Credential[];
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onEdit?: (credential: Credential) => void;
  isLoading?: boolean;
  categoryOptions?: string[];
}

const CredentialCard = ({
  credential,
  onDelete,
  onToggleFavorite,
  onEdit,
  categoryOptions,
}: {
  credential: Credential;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onEdit?: (credential: Credential) => void;
  categoryOptions?: string[];
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
        {credential.notes && (
          <div className="mb-3 p-2 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-500">Additional Information:</span>
            </div>
            <div className="text-sm whitespace-pre-wrap break-all">
              {credential.notes}
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
        <div className="flex space-x-2">
          {onEdit && (
            <EditCredentialDialog
              credential={credential}
              onSave={onEdit}
              categoryOptions={categoryOptions}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete && onDelete(credential.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function CredentialList({
  credentials = [],
  onDelete,
  onToggleFavorite,
  onEdit,
  isLoading = false,
  categoryOptions = [],
}: CredentialListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredCredentials = credentials.filter(
    (cred) =>
      cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCredentials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCredentials = filteredCredentials.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search credentials..."
            className="pl-9 bg-white text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-4 sm:mb-6" onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 flex flex-wrap overflow-x-auto text-xs sm:text-sm" style={{ scrollbarWidth: 'none' }}>
          <TabsTrigger value="all" disabled={isLoading} className="py-1 px-2 sm:py-2 sm:px-3">All</TabsTrigger>
          {categoryOptions.map(category => (
            <TabsTrigger
              key={category}
              value={category.toLowerCase()}
              disabled={isLoading}
              className="py-1 px-2 sm:py-2 sm:px-3 whitespace-nowrap"
            >
              {category}
            </TabsTrigger>
          ))}
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedCredentials.map((credential) => (
                  <CredentialCard
                    key={credential.id}
                    credential={credential}
                    onDelete={onDelete}
                    onToggleFavorite={onToggleFavorite}
                    onEdit={onEdit}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>Previous</span>
                        </Button>
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show first page, last page, current page, and pages around current
                        let pageToShow;

                        if (totalPages <= 5) {
                          // If 5 or fewer pages, show all pages
                          pageToShow = i + 1;
                        } else if (currentPage <= 3) {
                          // If near start, show first 5 pages
                          pageToShow = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          // If near end, show last 5 pages
                          pageToShow = totalPages - 4 + i;
                        } else {
                          // Otherwise show current page and 2 pages on each side
                          pageToShow = currentPage - 2 + i;
                        }

                        return (
                          <PaginationItem key={pageToShow}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageToShow)}
                              isActive={currentPage === pageToShow}
                              className="cursor-pointer"
                            >
                              {pageToShow}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1"
                        >
                          <span>Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>

                  <div className="text-center text-sm text-gray-500 mt-2">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredCredentials.length)} of {filteredCredentials.length} credentials
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Dynamically generate TabsContent for each category */}
        {categoryOptions.map(category => (
          <TabsContent key={category} value={category.toLowerCase()} className="mt-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-10 w-10 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-4"></div>
                <p className="text-gray-500">Loading your credentials...</p>
              </div>
            ) : filteredCredentials.filter((cred) => cred.category.toLowerCase() === category.toLowerCase()).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No {category.toLowerCase()} credentials found</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Add your first {category.toLowerCase()} credential to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredCredentials
                  .filter((cred) => cred.category.toLowerCase() === category.toLowerCase())
                  .map((credential) => (
                    <CredentialCard
                      key={credential.id}
                      credential={credential}
                      onDelete={() => onDelete(credential.id)}
                      onToggleFavorite={() => onToggleFavorite(credential.id)}
                      onEdit={onEdit}
                      categoryOptions={categoryOptions}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
