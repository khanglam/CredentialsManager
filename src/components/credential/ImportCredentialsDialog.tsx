import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Credential = {
  name: string;
  username: string;
  password: string;
  category?: string;
  strength?: "strong" | "medium" | "weak";
  favorite?: boolean;
  notes?: string;
};

interface ImportCredentialsDialogProps {
  onImport: (credentials: Credential[]) => void;
}

export default function ImportCredentialsDialog({ onImport }: ImportCredentialsDialogProps) {
  const [open, setOpen] = useState(false);
  const [importText, setImportText] = useState("");

  // Function to evaluate password strength
  const evaluatePasswordStrength = (password: string): "strong" | "medium" | "weak" => {
    if (!password) return "weak";
    
    // Check password length - more weight on length
    const lengthScore = password.length >= 12 ? 3 : (password.length >= 8 ? 2 : (password.length >= 6 ? 1 : 0));
    
    // Check for character variety
    const hasUppercase = /[A-Z]/.test(password) ? 1 : 0;
    const hasLowercase = /[a-z]/.test(password) ? 1 : 0;
    const hasNumbers = /[0-9]/.test(password) ? 1 : 0;
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password) ? 2 : 0; // More weight for special chars
    
    // Check for common patterns that weaken passwords
    let patternPenalty = 0;
    
    // Check for sequential numbers or letters
    if (/(?:012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      patternPenalty += 1;
    }
    
    // Check for repeated characters
    if (/([a-zA-Z0-9])\1{2,}/.test(password)) {
      patternPenalty += 1;
    }
    
    // Calculate variety score
    const varietyScore = hasUppercase + hasLowercase + hasNumbers + hasSpecialChars;
    
    // Calculate total score
    const totalScore = lengthScore + varietyScore - patternPenalty;
    
    // Determine strength based on score
    if (totalScore >= 5) return "strong";
    if (totalScore >= 3) return "medium";
    return "weak";
  };
  
  const parseCredentials = (text: string, format: "text" | "csv" = "text"): Credential[] => {
    const credentials: Credential[] = [];
    
    // Handle CSV format
    if (format === "csv") {
      const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length <= 1) return []; // Only header or empty
      
      // Skip header row
      const dataLines = lines.slice(1);
      
      for (const line of dataLines) {
        // Handle CSV parsing with potential quoted fields
        const parsedLine = parseCSVLine(line);
        if (parsedLine.length < 2) continue; // Need at least service and one other field
        
        const [service, username, password, category, notes] = parsedLine;
        
        if (service) {
          credentials.push({
            name: service,
            username: username || "",
            password: password || "",
            category: category || "Imported",
            strength: evaluatePasswordStrength(password || ""),
            favorite: false,
            notes: notes || "",
          });
        }
      }
      
      return credentials;
    }
    
    // Handle text format (original implementation)
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return [];

    // First line is always the service name
    const serviceName = lines[0].replace(/\(.*\)/, "").trim();
    
    // Second line might be a category/subcategory (e.g., KrisFlyer)
    let category = lines.length > 1 ? lines[1] : 'Imported';
    let startIndex = 1;
    if (lines.length > 1 && !lines[1].includes('@') && !lines[1].includes('\t') && !(/\s{2,}/).test(lines[1])) {
      startIndex = 2;
    } else {
      category = 'Imported';
    }

    // First pass: scan for explicit username
    let explicitUsername = '';
    let tempPassword = '';
    let tempEmail = '';
    let tabSeparatedPassword = '';
    
    // Look for explicit username first
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^username:/i.test(line)) {
        explicitUsername = line.split(':')[1]?.trim() || '';
        break;
      }
    }
    
    // Look for tab-separated credentials
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('\t') || /\s{2,}/.test(line)) {
        const parts = line.split(/\t|\s{2,}/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          if (!tempEmail && parts[0].includes('@')) {
            tempEmail = parts[0];
          }
          // Save the password from tab-separated line
          tabSeparatedPassword = parts[1];
          break;
        }
      }
    }

    // Look for password line
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^password:/i.test(line)) {
        tempPassword = line.split(':')[1]?.trim() || '';
        break;
      }
    }

    // Now process all lines to build the credential
    let username = explicitUsername || tempEmail || '';
    let password = tempPassword || tabSeparatedPassword || '';
    let notes: string[] = [];
    
    // Second pass: collect all information
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') continue;

      // Skip the username line since we already processed it
      if (/^username:/i.test(line)) {
        continue;
      }
      
      // Skip the password line since we already processed it
      if (/^password:/i.test(line)) {
        continue;
      }
      
      // If this is the tab-separated line with email/password
      if ((line.includes('\t') || /\s{2,}/.test(line))) {
        const parts = line.split(/\t|\s{2,}/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          // If we have an explicit username, add the email to notes
          if (explicitUsername && parts[0].includes('@')) {
            notes.push(parts[0]);
          }
          
          // If we don't have a password yet, use this one
          if (!password && parts.length >= 2) {
            password = parts[1];
          }
          
          // Add any additional parts to notes
          if (parts.length > 2) {
            for (let j = 2; j < parts.length; j++) {
              notes.push(parts[j]);
            }
          }
          continue;
        }
      }

      // Handle PIN line
      if (/^pin:/i.test(line)) {
        notes.push(line); // Keep the full line with 'pin:' prefix
        continue;
      }
      
      // Handle Questions section
      if (/^questions:/i.test(line)) {
        notes.push('Questions:');
        continue;
      }
      
      // Handle email - if we have an explicit username, add email to notes
      if (line.includes('@')) {
        if (explicitUsername) {
          notes.push(line);
        } else if (!username) {
          username = line;
        } else {
          notes.push(line);
        }
        continue;
      }
      
      // If no password yet and this looks like a password
      if (!password && !line.includes(':') && line.length > 3) {
        password = line;
        continue;
      }
      
      // Otherwise, add to notes
      notes.push(line);
    }

    // Build the credential if we have enough info
    if (username || password) {
      credentials.push({
        name: serviceName,
        username,
        password,
        category,
        strength: evaluatePasswordStrength(password),
        favorite: false,
        notes: notes.length > 0 ? notes.join('\n') : undefined,
      });
    } else if (notes.length > 0) {
      // Fallback: just put all in notes
      credentials.push({
        name: serviceName,
        username: '',
        password: '',
        category,
        strength: 'weak',
        favorite: false,
        notes: notes.join('\n'),
      });
    }

    return credentials;
  };

  // Helper function to parse CSV lines correctly, handling quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        // Toggle quote state
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current);
        current = "";
      } else {
        // Add character to current field
        current += char;
      }
    }
    
    // Add the last field
    result.push(current);
    return result;
  };
  
  const detectFormat = (text: string): "text" | "csv" => {
    // Check if it looks like a CSV with header row
    const firstLine = text.split("\n")[0]?.trim();
    if (firstLine && 
        (firstLine.toLowerCase().includes("service") && 
         firstLine.toLowerCase().includes("username") && 
         firstLine.toLowerCase().includes("password"))) {
      return "csv";
    }
    return "text";
  };
  
  const [importFormat, setImportFormat] = useState<"text" | "csv">("text");
  
  const handleImport = () => {
    try {
      // Use the selected format
      const credentials = parseCredentials(importText, importFormat);

      
      if (credentials.length === 0) {
        toast({
          title: "No credentials found",
          description: "Could not parse any credentials from the text. Please check the format.",
          variant: "destructive",
        });
        return;
      }
      
      onImport(credentials);
      setOpen(false);
      setImportText("");
      
      toast({
        title: "Import successful",
        description: `Imported ${credentials.length} credentials.`,
      });
    } catch (error) {
      console.error("Error parsing credentials:", error);
      toast({
        title: "Import failed",
        description: "There was an error parsing your credentials.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto-detect format based on file extension
    if (file.name.toLowerCase().endsWith(".csv")) {
      setImportFormat("csv");
    } else {
      setImportFormat("text");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportText(text);
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Import Credentials</DialogTitle>
          <DialogDescription>
            Import your credentials from a CSV file or paste text directly.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="text" value={importFormat} onValueChange={(value) => setImportFormat(value as "text" | "csv")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Format</TabsTrigger>
            <TabsTrigger value="csv">CSV Format</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-4">
            <div className="text-sm text-gray-500 mb-2">
              Paste credentials with service name followed by username and password on separate lines.
            </div>
          </TabsContent>
          
          <TabsContent value="csv" className="mt-4">
            <div className="text-sm text-gray-500 mb-2">
              Import CSV with columns: Service, Username, Password, Category, Notes.
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder={importFormat === "csv" ? 
              "Service,Username,Password,Category,Notes\nGmail,user@gmail.com,password123,Personal,My main email" : 
              "Gmail\nUsername: user@gmail.com\nPassword: password123"}
            className="h-[200px]"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Or upload a file:</span>
            <input
              type="file"
              accept={importFormat === "csv" ? ".csv" : ".txt,.csv"}
              onChange={handleFileUpload}
              className="text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import Credentials</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
