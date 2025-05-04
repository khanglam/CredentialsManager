import { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import CredentialList from "../credential/CredentialList";
import AddCredentialDialog from "../credential/AddCredentialDialog";
import ImportCredentialsDialog from "../credential/ImportCredentialsDialog";
import { Key, Star, Lock, Shield } from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { useToast } from "@/components/ui/use-toast";
import { calculatePasswordStrength } from "@/lib/passwordUtils";
import { Button } from "@/components/ui/button";

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

const sidebarItems = [
  { icon: <Key size={20} />, label: "All Credentials", isActive: true },
  { icon: <Star size={20} />, label: "Favorites" },
  { icon: <Shield size={20} />, label: "Security Report", href: "/security-report" },
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
        notes: cred.notes || '',
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

      // Update local state
      setCredentials(prev => prev.filter(cred => cred.id !== id));
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

  const handleEdit = async (updatedCredential: Credential) => {
    try {
      // Format the data for Supabase
      const supabaseData = {
        name: updatedCredential.name,
        username: updatedCredential.username,
        password: updatedCredential.password,
        strength: updatedCredential.strength,
        category: updatedCredential.category,
        favorite: updatedCredential.favorite,
        last_updated: new Date().toISOString(),
        notes: updatedCredential.notes || '',
      };

      const { error } = await supabase
        .from('credentials')
        .update(supabaseData)
        .eq('id', updatedCredential.id);

      if (error) {
        console.error('Error updating credential:', error);
        toast({
          title: "Error",
          description: "Failed to update credential",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setCredentials(prev =>
        prev.map(cred =>
          cred.id === updatedCredential.id ? updatedCredential : cred
        )
      );
      toast({
        title: "Success",
        description: "Credential updated successfully",
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

  const handleDeleteAllCredentials = async () => {
    if (!confirm('Are you sure you want to delete ALL credentials? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);

      // Get all credentials first
      const { data } = await supabase
        .from('credentials')
        .select('id');

      if (data && data.length > 0) {
        // Delete each credential individually
        for (const cred of data) {
          await supabase
            .from('credentials')
            .delete()
            .eq('id', cred.id);
        }

        // Update local state
        setCredentials([]);
        toast({
          title: "Success",
          description: `Deleted ${data.length} credentials successfully`,
        });
      } else {
        toast({
          title: "Info",
          description: "No credentials found to delete",
        });
      }
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

  const handleAddCredential = async (newCred: {
    name: string;
    username: string;
    password: string;
    category: string;
    notes?: string;
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
        notes: newCred.notes || '',
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
        notes: data[0].notes || '',
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

  // Filter credentials based on active sidebar item
  const filteredCredentials = () => {
    if (activeItem === 'Favorites') {
      return credentials.filter(cred => cred.favorite);
    }
    return credentials;
  };

  // Handle bulk import of credentials
  const handleImportCredentials = async (importedCredentials: any[]) => {
    try {
      setLoading(true);

      // Prepare credentials for insertion with user_id and strength
      const credentialsToInsert = importedCredentials.map(cred => {
        // Ensure strength is a string value ("strong", "medium", or "weak")
        let strength = cred.strength;
        if (!strength) {
          // If no strength provided, calculate it
          const strengthResult = calculatePasswordStrength(cred.password);
          strength = strengthResult.strength;
        }

        // Ensure strength is one of the allowed values
        if (typeof strength === 'number' || !['strong', 'medium', 'weak'].includes(strength)) {
          strength = 'medium'; // Default to medium if invalid
        }

        return {
          user_id: user?.id,
          name: cred.name,
          username: cred.username,
          password: cred.password,
          category: cred.category || 'Imported',
          strength: strength,
          last_updated: new Date().toISOString(),
          favorite: cred.favorite || false,
          notes: cred.notes || '',
        };
      });

      // Insert into Supabase
      const { data, error } = await supabase
        .from('credentials')
        .insert(credentialsToInsert)
        .select();

      if (error) {
        console.error('Error importing credentials:', error);
        toast({
          title: "Error",
          description: `Failed to import credentials: ${error.message || error.details || 'Unknown error'}`,
          variant: "destructive",
        });
        return;
      }

      // Format the returned data
      const newCredentials = data.map((cred: any) => ({
        id: cred.id,
        name: cred.name,
        username: cred.username,
        password: cred.password,
        strength: cred.strength,
        category: cred.category,
        favorite: cred.favorite,
        lastUpdated: new Date(cred.last_updated).toISOString().split('T')[0],
      }));

      setCredentials([...credentials, ...newCredentials]);
      toast({
        title: "Success",
        description: `${newCredentials.length} credentials imported successfully`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during import",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password generator click
  const handlePasswordGeneratorClick = () => {
    toast({
      title: "Password Generator",
      description: "Use the 'Generate' button when adding a new credential to create a strong password.",
    });
  };

  // Update sidebar click handler
  useEffect(() => {
    if (activeItem === 'Password Generator') {
      handlePasswordGeneratorClick();
      setActiveItem('All Credentials'); // Reset to All Credentials
    }
  }, [activeItem]);

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
                  {activeItem === 'Favorites' ? 'Favorite Credentials' : 'Credentials Vault'}
                </h1>
                <p className="text-gray-500">
                  {activeItem === 'Favorites'
                    ? 'Your most important credentials'
                    : 'Securely manage all your credentials'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAllCredentials}
                  className="ml-2"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete All Credentials'}
                </Button>
                <ImportCredentialsDialog onImport={handleImportCredentials} />
                <AddCredentialDialog onSave={handleAddCredential} />
              </div>
            </div>

            <CredentialList
              credentials={filteredCredentials()}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
              onEdit={handleEdit}
              isLoading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}