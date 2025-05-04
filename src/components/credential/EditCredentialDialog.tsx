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
}

export default function EditCredentialDialog({ credential, onSave }: EditCredentialDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Credential>({ ...credential });

  // Reset form data when credential changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({ ...credential });
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
    setFormData(prev => ({ ...prev, category: value }));
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
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Imported">Imported</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
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
