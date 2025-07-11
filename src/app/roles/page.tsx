
'use client';

import Link from 'next/link';
import {
  Briefcase,
  UserSearch,
  User,
  Search,
  MessageSquare,
  Eye,
  BookOpen,
  HelpCircle,
  Mail,
  Info,
  Menu,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const sidebarLinks = [
  { icon: Search, label: 'Search jobs', href: '/job-seeker/search' },
  { icon: MessageSquare, label: 'Chat for help', href: '#' },
  { icon: Eye, label: 'Display preferences', href: '#' },
  { icon: BookOpen, label: 'HireJacks blog', href: '#' },
  { icon: HelpCircle, label: 'How HireJacks works', href: '#' },
  { icon: Mail, label: 'Write to us', href: '#' },
  { icon: Info, label: 'About us', href: '#' },
];

function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-card text-card-foreground">
      <SheetHeader className="p-4 text-left">
        <SheetTitle>Menu</SheetTitle>
        <div className="flex items-center gap-4">
          <div className="rounded-full border p-2">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Build your profile</h2>
            <p className="text-sm text-muted-foreground">
              Job opportunities are waiting for you.
            </p>
          </div>
        </div>
      </SheetHeader>
      <div className="p-4">
        <Link href="/roles">
          <Button className="w-full bg-accent hover:bg-accent/90">
            Get Started
          </Button>
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 space-y-2 p-4">
        {sidebarLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <Separator />
      <div className="p-4 text-center text-sm text-muted-foreground">
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
}


export default function RoleSelectionPage() {
  return (
     <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <Briefcase className="h-6 w-6" />
            <span className="text-xl">HireJacks</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl sm:text-5xl text-primary tracking-tight">
            Choose Your Role
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Your next career move or top talent is just a click away.
            Select your path to get started.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <Link href="/job-seeker/login">
            <Card className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/50">
              <CardHeader className="flex flex-col items-center justify-center text-center p-8">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Briefcase className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Job Seeker</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Find jobs, get AI-powered suggestions, and build your career.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/recruiter">
            <Card className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-accent/50">
              <CardHeader className="flex flex-col items-center justify-center text-center p-8">
                <div className="p-4 bg-accent/10 rounded-full mb-4">
                  <UserSearch className="h-12 w-12 text-accent" />
                </div>
                <CardTitle className="text-2xl font-semibold">Recruiter</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Post jobs, manage applicants, and find the perfect candidate.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
