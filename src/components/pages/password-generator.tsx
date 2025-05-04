import { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Copy, Check } from "lucide-react";
import { generatePassword, calculatePasswordStrength } from "@/lib/passwordUtils";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    strength: 'weak' | 'medium' | 'strong';
    score: number;
  }>({ strength: 'weak', score: 0 });

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(passwordLength, {
      uppercase: includeUppercase,
      lowercase: includeLowercase,
      numbers: includeNumbers,
      symbols: includeSymbols,
    });
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="Password Generator" />
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Password Generator</h1>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Generate a Secure Password</CardTitle>
                <CardDescription>
                  Create strong, unique passwords to keep your accounts secure.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="relative">
                  <Input 
                    value={password} 
                    readOnly 
                    placeholder="Your generated password will appear here"
                    className="pr-20 font-mono text-base h-12"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={handleCopyPassword}
                      disabled={!password}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                {password && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Password Strength</span>
                      <span className="capitalize">{passwordStrength.strength}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor(passwordStrength.strength)}`}
                        style={{
                          width: `${(passwordStrength.score / 9) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Password Length: {passwordLength}</Label>
                    </div>
                    <Slider
                      value={[passwordLength]}
                      min={6}
                      max={32}
                      step={1}
                      onValueChange={(value) => setPasswordLength(value[0])}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="uppercase">Include Uppercase Letters</Label>
                      <Switch
                        id="uppercase"
                        checked={includeUppercase}
                        onCheckedChange={setIncludeUppercase}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="lowercase">Include Lowercase Letters</Label>
                      <Switch
                        id="lowercase"
                        checked={includeLowercase}
                        onCheckedChange={setIncludeLowercase}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="numbers">Include Numbers</Label>
                      <Switch
                        id="numbers"
                        checked={includeNumbers}
                        onCheckedChange={setIncludeNumbers}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="symbols">Include Symbols</Label>
                      <Switch
                        id="symbols"
                        checked={includeSymbols}
                        onCheckedChange={setIncludeSymbols}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleGeneratePassword} 
                  className="w-full bg-blue-500 hover:bg-blue-600 gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate Password
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-medium mb-2">Password Security Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Use a different password for each account</li>
                <li>Aim for at least 12 characters for better security</li>
                <li>Include a mix of letters, numbers, and symbols</li>
                <li>Avoid using personal information in your passwords</li>
                <li>Consider using a password manager to store your credentials securely</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
