
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

export default function StudentAuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
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
        const users = JSON.parse(localStorage.getItem('studentUsers') || '[]');
        const user = users.find((u: any) => u.email === loginEmail && u.password === loginPassword);

        if (user) {
            // A real app would fetch the full profile here
            const profileToStore = {
              data: {
                  firstName: user.name.split(' ')[0] || '',
                  lastName: user.name.split(' ')[1] || '',
                  email: user.email,
                  headline: '',
                  summary: '',
              },
              resumeFile: null,
              profilePhoto: null,
              photoPreview: null,
              timestamp: new Date().toISOString()
            };
            localStorage.setItem('userProfile', JSON.stringify(profileToStore));
            router.push('/student/profile');
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
    if (!signupName || !signupEmail || !signupPassword) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "Please fill out all fields.",
      });
      return;
    }

    try {
        const users = JSON.parse(localStorage.getItem('studentUsers') || '[]');
        const existingUser = users.find((u: any) => u.email === signupEmail);
        
        if (existingUser) {
            toast({
                variant: "destructive",
                title: "Signup Failed",
                description: "An account with this email already exists.",
            });
            return;
        }

        const newUser = { name: signupName, email: signupEmail, password: signupPassword };
        users.push(newUser);
        localStorage.setItem('studentUsers', JSON.stringify(users));

        const [firstName, lastName] = signupName.split(' ');
        const profileToStore = {
            data: { firstName, lastName, email: signupEmail, headline: '', summary: '' },
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem('userProfile', JSON.stringify(profileToStore));
        
        toast({
            title: "Account Created!",
            description: "You have been successfully signed up.",
        });
        
        router.push('/student/profile');
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
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to continue your job search.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
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
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Join HireJacks to find your dream job.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="John Doe" required value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="m@example.com" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
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
