import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Pencil } from "lucide-react";
import { calculatePasswordStrength } from "@/lib/passwordUtils";

type Credential = {
  id: number;
  name: string;
  username: string;
  password: string;
  strength: "strong" | "medium" | "weak";
  category: string;
  favorite: boolean;
  lastUpdated: string;
  notes?: string;
};

interface EditCredentialDialogProps {
  credential: Credential;
  onSave: (updatedCredential: Credential) => void;
  categoryOptions?: string[];
}

export default function EditCredentialDialog({ credential, onSave, categoryOptions = [] }: EditCredentialDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Credential>({ ...credential });
  // Use the categoryOptions passed from props
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Reset form data when credential changes or dialog opens
  useEffect(() => {
    if (open) {
      // Make sure to include the category and set a default if it's missing
      setFormData({ 
        ...credential,
        category: credential.category || 'Other' // Ensure category is never undefined
      });
    }
  }, [credential, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // Update password strength if password changes
      if (name === 'password') {
        const { strength } = calculatePasswordStrength(value);
        updated.strength = strength;
      }

      return updated;
    });
  };

  const handleCategoryChange = (value: string) => {
    if (value === "__add_new__") {
      setAddingCategory(true);
    } else {
      setFormData(prev => ({ ...prev, category: value }));
      console.log('Category changed to:', value);
    }
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.username || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Name, username, and password are required.",
        variant: "destructive",
      });
      return;
    }

    // Update lastUpdated date
    const updatedCredential = {
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onSave(updatedCredential);
    setOpen(false);

    toast({
      title: "Credential Updated",
      description: `${updatedCredential.name} has been updated successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
          <DialogDescription>
            Update your credential details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3">
              <Select
                key={formData.category}
                defaultValue={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    // Always include the credential's current category, even if not in categoryOptions
                    const allOptions = categoryOptions.includes(formData.category)
                      ? categoryOptions
                      : [...categoryOptions, formData.category].filter(Boolean);
                    return allOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ));
                  })()}
                  <SelectItem value="__add_new__">+ Add new category…</SelectItem>
                </SelectContent>
              </Select>
              {addingCategory && (
                <div className="flex mt-2 gap-2">
                  <Input
                    autoFocus
                    placeholder="New category name"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (newCategory.trim() && !categoryOptions.includes(newCategory.trim())) {
                        // Notify parent component about the new category
                        setFormData(prev => ({ ...prev, category: newCategory.trim() }));
                        // We'll handle adding to categoryOptions in the parent component
                      }
                      setAddingCategory(false);
                      setNewCategory("");
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setAddingCategory(false);
                      setNewCategory("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              className="col-span-3"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
