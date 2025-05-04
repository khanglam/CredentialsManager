import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Credential {
  id: number;
  name: string;
  username: string;
  password: string;
  strength: "strong" | "medium" | "weak";
  category: string;
  favorite: boolean;
  lastUpdated?: string;
  notes?: string;
  user_id?: string;
}

interface SecurityIssue {
  id: number;
  credentialId: number;
  type: "weak_password" | "reused_password" | "old_password";
  severity: "high" | "medium" | "low";
  description: string;
  recommendation: string;
}

// Simple password strength calculator that returns a category
const calculatePasswordStrength = (password: string): {score: number; strength: "strong" | "medium" | "weak"} => {
  if (!password) return {score: 0, strength: "weak"};
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1; // Has uppercase
  if (/[a-z]/.test(password)) score += 1; // Has lowercase
  if (/[0-9]/.test(password)) score += 1; // Has number
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
  
  // Normalize to 0-10 scale
  const normalizedScore = Math.min(10, score * 1.67);
  
  // Determine strength category
  let strength: "strong" | "medium" | "weak" = "weak";
  if (normalizedScore >= 7) strength = "strong";
  else if (normalizedScore >= 4) strength = "medium";
  
  return {score: normalizedScore, strength};
};

export default function SecurityReport() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([]);
  const [securityScore, setSecurityScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch credentials from Supabase
  useEffect(() => {
    const fetchCredentials = async () => {
      if (!user) return;
      
      try {
        // This would be replaced with your actual Supabase client
        // const { data, error } = await supabase
        //   .from('credentials')
        //   .select('*')
        //   .eq('user_id', user.id);
        
        // For demo purposes, use sample data instead
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
            notes: "Work account"
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
          {
            id: 6,
            name: "Twitter",
            username: "socialuser",
            password: "P@ssw0rd123!", // Reused password
            strength: "strong",
            category: "social",
            favorite: false,
            lastUpdated: "2023-09-15",
          },
        ];

        setCredentials(sampleCredentials);
        analyzeSecurityIssues(sampleCredentials);
      } catch (error) {
        console.error('Error fetching credentials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, [user]);

  const analyzeSecurityIssues = (credentials: Credential[]) => {
    const issues: SecurityIssue[] = [];
    let issueId = 1;
    const passwords: { [key: string]: number[] } = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Group credentials by password to find reused passwords
    credentials.forEach(cred => {
      if (!passwords[cred.password]) {
        passwords[cred.password] = [];
      }
      passwords[cred.password].push(cred.id);
    });

    // Check for weak passwords
    credentials.forEach(cred => {
      const passwordStrength = calculatePasswordStrength(cred.password);
      
      if (passwordStrength.strength === 'weak') {
        issues.push({
          id: issueId++,
          credentialId: cred.id,
          type: 'weak_password',
          severity: 'high',
          description: `Weak password detected for ${cred.name}`,
          recommendation: 'Use a stronger password with a mix of uppercase, lowercase, numbers, and symbols.'
        });
      }
      
      // Check for old passwords
      const lastUpdated = new Date(cred.lastUpdated);
      if (lastUpdated < sixMonthsAgo) {
        issues.push({
          id: issueId++,
          credentialId: cred.id,
          type: 'old_password',
          severity: 'medium',
          description: `Password for ${cred.name} hasn't been updated in over 6 months`,
          recommendation: 'Regularly update your passwords every 3-6 months for better security.'
        });
      }
    });

    // Check for reused passwords
    Object.entries(passwords).forEach(([password, credIds]) => {
      if (credIds.length > 1) {
        const affectedCredentials = credentials.filter(c => credIds.includes(c.id));
        const credentialNames = affectedCredentials.map(c => c.name).join(', ');
        
        issues.push({
          id: issueId++,
          credentialId: credIds[0],
          type: 'reused_password',
          severity: 'high',
          description: `Password reused across multiple accounts: ${credentialNames}`,
          recommendation: 'Use unique passwords for each account to prevent security breaches from affecting multiple accounts.'
        });
      }
    });

    setSecurityIssues(issues);

    // Calculate security score
    const totalCredentials = credentials.length;
    const uniquePasswords = Object.keys(passwords).length;
    const strongPasswords = credentials.filter(c => calculatePasswordStrength(c.password).strength === 'strong').length;
    const recentPasswords = credentials.filter(c => {
      const lastUpdated = new Date(c.lastUpdated);
      return lastUpdated >= sixMonthsAgo;
    }).length;

    // Score formula: 100 - (issues / credentials) * 100, with a minimum of 0
    const score = Math.max(0, Math.min(100, Math.round(
      (strongPasswords / totalCredentials * 40) + 
      (uniquePasswords / totalCredentials * 40) + 
      (recentPasswords / totalCredentials * 20)
    )));
    
    setSecurityScore(score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "low":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/credentials" className="mr-4">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Credentials
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Security Report</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overall Score</CardTitle>
              <CardDescription>Your password security rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-4">
                <div className={`text-5xl font-bold ${getScoreColor(securityScore)}`}>
                  {securityScore}
                </div>
                <Progress value={securityScore} className="w-full mt-4" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Credentials</CardTitle>
              <CardDescription>Your stored accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-5xl font-bold text-blue-500">
                  {credentials.length}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Total accounts protected
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Security Issues</CardTitle>
              <CardDescription>Problems that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-5xl font-bold text-red-500">
                  {securityIssues.length}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {securityIssues.length === 0 ? "No issues found" : "Issues to resolve"}
                </div>
                <ul className="mt-4 space-y-2 w-full">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full flex-shrink-0 mt-0.5">1</div>
                    <div>
                      <h3 className="font-medium">Use unique passwords</h3>
                      <p className="text-sm text-gray-600">Never reuse passwords across different accounts.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full flex-shrink-0 mt-0.5">2</div>
                    <div>
                      <h3 className="font-medium">Create strong passwords</h3>
                      <p className="text-sm text-gray-600">Use a mix of uppercase, lowercase, numbers, and symbols.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full flex-shrink-0 mt-0.5">3</div>
                    <div>
                      <h3 className="font-medium">Update regularly</h3>
                      <p className="text-sm text-gray-600">Change your passwords every 3-6 months for better security.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full flex-shrink-0 mt-0.5">4</div>
                    <div>
                      <h3 className="font-medium">Enable two-factor authentication</h3>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your important accounts.</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button className="bg-blue-500 hover:bg-blue-600">Fix All Issues</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
