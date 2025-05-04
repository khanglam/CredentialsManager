import { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
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

interface SecurityIssue {
  id: number;
  credentialId: number;
  type: "weak_password" | "reused_password" | "old_password";
  severity: "high" | "medium" | "low";
  description: string;
  recommendation: string;
}

export default function SecurityReport() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([]);
  const [securityScore, setSecurityScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simulate fetching credentials
  useEffect(() => {
    // In a real app, this would come from your database
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
    setLoading(false);
  }, []);

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

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="Security Report" />
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Security Report</h1>
            
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
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {securityIssues.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Security Issues</CardTitle>
                  <CardDescription>
                    We've identified the following security concerns with your credentials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityIssues.map((issue) => {
                      const credential = credentials.find(c => c.id === issue.credentialId);
                      return (
                        <div key={issue.id} className="p-4 border rounded-lg bg-white">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {getSeverityIcon(issue.severity)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium">{issue.description}</h3>
                                <span className={`text-xs font-medium uppercase ${getSeverityColor(issue.severity)}`}>
                                  {issue.severity} risk
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{issue.recommendation}</p>
                              {credential && (
                                <div className="mt-2">
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {credential.name} • {credential.username}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium text-center">All Secure!</h3>
                  <p className="text-gray-500 text-center mt-2">
                    Your password security is excellent. Keep up the good work!
                  </p>
                </CardContent>
              </Card>
            )}
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-blue-500" />
                <h2 className="text-lg font-medium">Security Recommendations</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Use unique passwords</h3>
                    <p className="text-sm text-gray-600">Never reuse passwords across different accounts.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Create strong passwords</h3>
                    <p className="text-sm text-gray-600">Use a mix of uppercase, lowercase, numbers, and symbols.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Update regularly</h3>
                    <p className="text-sm text-gray-600">Change your passwords every 3-6 months for better security.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Enable two-factor authentication</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your important accounts.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Fix All Issues
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
