
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function RecruiterAuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupCompany, setSignupCompany] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please enter both email and password.",
      });
      return;
    }
    
    try {
        const recruiters = JSON.parse(localStorage.getItem('recruiterUsers') || '[]');
        const recruiter = recruiters.find((r: any) => r.email === loginEmail && r.password === loginPassword);

        if (recruiter) {
             // You can also store recruiter-specific info if needed
            localStorage.setItem('recruiterProfile', JSON.stringify({ company: recruiter.company, email: recruiter.email }));
            router.push('/recruiter');
        } else {
             toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid email or password.",
            });
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Login Error",
            description: "An unexpected error occurred.",
        });
    }
  };

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!signupCompany || !signupEmail || !signupPassword) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "Please fill out all fields.",
      });
      return;
    }

    try {
        const recruiters = JSON.parse(localStorage.getItem('recruiterUsers') || '[]');
        const existingRecruiter = recruiters.find((r: any) => r.email === signupEmail);

        if (existingRecruiter) {
            toast({
                variant: "destructive",
                title: "Signup Failed",
                description: "An account with this email already exists.",
            });
            return;
        }

        const newRecruiter = { company: signupCompany, email: signupEmail, password: signupPassword };
        recruiters.push(newRecruiter);
        localStorage.setItem('recruiterUsers', JSON.stringify(recruiters));
        
        localStorage.setItem('recruiterProfile', JSON.stringify({ company: newRecruiter.company, email: newRecruiter.email }));

        toast({
            title: "Account Created!",
            description: "Your recruiter account has been successfully created.",
        });

        router.push('/recruiter');
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Signup Error",
            description: "An unexpected error occurred.",
        });
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-2 text-primary mb-8">
          <Briefcase className="h-8 w-8" />
          <h1 className="text-3xl font-bold">HireJacks</h1>
        </div>
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Recruiter Login</CardTitle>
              <CardDescription>
                Sign in to manage your job postings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="recruiter@company.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleLogin}>Login</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create Recruiter Account</CardTitle>
              <CardDescription>
                Join HireJacks to find the best talent.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" type="text" placeholder="Your Company Inc." required value={signupCompany} onChange={(e) => setSignupCompany(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="recruiter@company.com" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleSignup}>Create Account</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
