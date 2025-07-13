
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Briefcase,
  Menu,
  User,
  UserSearch,
  Zap,
  FileText,
  Target,
} from 'lucide-react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const sidebarLinks = [
  { href: '/roles', label: 'Get Started' },
  { href: '/student/search', label: 'Search Jobs' },
  { href: '#', label: 'How HireJacks Works' },
  { href: '#', label: 'About Us' },
];

function MobileSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <Briefcase className="h-6 w-6" />
            <span className="text-xl">HireJacks</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarLinks.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} className="w-full">
                <SidebarMenuButton className="w-full justify-start">
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default function IntroductionPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-dvh flex-col bg-background">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
              <Briefcase className="h-6 w-6" />
              <span className="text-xl">HireJacks</span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex gap-6 items-center">
                <Link href="/roles" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Get Started
                </Link>
                <Link href="/student/apply" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Browse Jobs
                </Link>
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <MobileSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main className="flex-1">
          <section className="flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto text-center py-20 px-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tight">
              Welcome to HireJacks
            </h1>
            <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground">
              The seamless platform to connect skilled students with innovative organizations. Your next opportunity is just a click away.
            </p>
            <Image
                src="https://placehold.co/600x400.png"
                alt="Handshake between an admin and a student"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                data-ai-hint="recruitment handshake"
              />
            <Link href="/roles">
              <Button size="lg" className="group transform transition-transform duration-300 hover:scale-105">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </section>

          <section className="bg-card py-20 px-4">
             <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                   <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How HireJacks Works for You</h2>
                   <p className="mt-4 text-lg text-muted-foreground">Whether you're seeking talent or opportunity, we've got you covered.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-primary/30">
                        <CardHeader className="flex flex-row items-center gap-4">
                           <div className="p-3 bg-primary/10 rounded-full">
                               <User className="h-8 w-8 text-primary"/>
                           </div>
                           <div>
                               <CardTitle className="text-2xl font-semibold">For Students</CardTitle>
                               <CardDescription>Find your next big opportunity.</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <Zap className="w-5 h-5 mt-0.5 text-primary shrink-0"/>
                                <p><span className="font-semibold">AI-Powered Recommendations:</span> Get job suggestions tailored to your unique skills and profile.</p>
                            </div>
                             <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 mt-0.5 text-primary shrink-0"/>
                                <p><span className="font-semibold">Build Your Profile:</span> Create a professional profile and upload your resume to stand out.</p>
                            </div>
                             <div className="flex items-start gap-3">
                                <Target className="w-5 h-5 mt-0.5 text-primary shrink-0"/>
                                <p><span className="font-semibold">Apply with Ease:</span> Browse and apply for jobs from top companies with a single click.</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="border-accent/30">
                        <CardHeader className="flex flex-row items-center gap-4">
                           <div className="p-3 bg-accent/10 rounded-full">
                               <UserSearch className="h-8 w-8 text-accent"/>
                           </div>
                           <div>
                               <CardTitle className="text-2xl font-semibold">For Recruiters</CardTitle>
                               <CardDescription>Discover top-tier student talent.</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <Briefcase className="w-5 h-5 mt-0.5 text-accent shrink-0"/>
                                <p><span className="font-semibold">Post Jobs Easily:</span> Create and manage job postings to reach a wide pool of candidates.</p>
                            </div>
                             <div className="flex items-start gap-3">
                                <User className="w-5 h-5 mt-0.5 text-accent shrink-0"/>
                                <p><span className="font-semibold">Manage Applicants:</span> Review applications and view student profiles all in one place.</p>
                            </div>
                             <div className="flex items-start gap-3">
                                <Zap className="w-5 h-5 mt-0.5 text-accent shrink-0"/>
                                <p><span className="font-semibold">Powerful Analytics:</span> Gain insights on your job postings and applicant engagement.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
             </div>
          </section>
        </main>
        <footer className="bg-card border-t">
          <div className="container mx-auto py-6 text-center text-muted-foreground text-sm">
             <p>&copy; {new Date().getFullYear()} HireJacks. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
}
