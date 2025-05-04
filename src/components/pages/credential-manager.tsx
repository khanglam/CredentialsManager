import { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import CredentialList from "../credential/CredentialList";
import AddCredentialDialog from "../credential/AddCredentialDialog";
import { Key, Star, Shield, Lock } from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { useToast } from "@/components/ui/use-toast";
import { calculatePasswordStrength } from "@/lib/passwordUtils";

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

export default function CredentialManager() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [activeItem, setActiveItem] = useState("All Credentials");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch credentials from Supabase on component mount
  useEffect(() => {
    if (user) {
      fetchCredentials();
    }
  }, [user]);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching credentials:', error);
        toast({
          title: "Error",
          description: "Failed to load credentials",
          variant: "destructive",
        });
        return;
      }
      
      // Transform the data to match our Credential interface
      const formattedData = data.map(cred => ({
        id: cred.id,
        name: cred.name,
        username: cred.username,
        password: cred.password,
        strength: cred.strength as "strong" | "medium" | "weak",
        category: cred.category,
        favorite: cred.favorite,
        lastUpdated: new Date(cred.last_updated).toISOString().split('T')[0],
      }));
      
      setCredentials(formattedData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting credential:', error);
        toast({
          title: "Error",
          description: "Failed to delete credential",
          variant: "destructive",
        });
        return;
      }
      
      setCredentials(credentials.filter((cred) => cred.id !== id));
      toast({
        title: "Success",
        description: "Credential deleted successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      const credential = credentials.find(cred => cred.id === id);
      if (!credential) return;
      
      const { error } = await supabase
        .from('credentials')
        .update({ favorite: !credential.favorite })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating favorite status:', error);
        toast({
          title: "Error",
          description: "Failed to update favorite status",
          variant: "destructive",
        });
        return;
      }
      
      setCredentials(
        credentials.map((cred) =>
          cred.id === id ? { ...cred, favorite: !cred.favorite } : cred,
        ),
      );
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAddCredential = async (newCred: {
    name: string;
    username: string;
    password: string;
    category: string;
  }) => {
    try {
      // Calculate password strength
      const passwordStrength = calculatePasswordStrength(newCred.password);
      
      // Prepare the credential for insertion
      const credentialData = {
        user_id: user?.id, // Add user_id for Row Level Security
        name: newCred.name,
        username: newCred.username,
        password: newCred.password,
        strength: passwordStrength.strength,
        category: newCred.category,
        favorite: false,
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('credentials')
        .insert(credentialData)
        .select();
      
      if (error) {
        console.error('Error adding credential:', error);
        console.log('Attempted to insert with data:', { ...credentialData, password: '***' });
        toast({
          title: "Error",
          description: `Failed to add credential: ${error.message || error.details || 'Unknown error'}`,
          variant: "destructive",
        });
        return;
      }
      
      // Format the returned data
      const newCredential: Credential = {
        id: data[0].id,
        name: data[0].name,
        username: data[0].username,
        password: data[0].password,
        strength: data[0].strength,
        category: data[0].category,
        favorite: data[0].favorite,
        lastUpdated: new Date(data[0].last_updated).toISOString().split('T')[0],
      };
      
      setCredentials([...credentials, newCredential]);
      toast({
        title: "Success",
        description: "Credential added successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
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
              isLoading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
