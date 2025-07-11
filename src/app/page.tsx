
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  User,
  Search,
  MessageSquare,
  Briefcase,
  Eye,
  BookOpen,
  HelpCircle,
  Mail,
  Info,
  Menu,
} from 'lucide-react';
import Image from 'next/image';
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

export default function IntroductionPage() {
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
      <main className="flex flex-1 items-center justify-center p-4 text-center">
        <div className="flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto">
           <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tight">
             Welcome to HireJacks
           </h1>
           <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground">
             The seamless platform to connect skilled professionals with innovative companies. Your next opportunity is just a click away.
           </p>
           <Image
               src="https://placehold.co/600x400.png"
               alt="Handshake between a recruiter and a job seeker"
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
         </div>
      </main>
    </div>
  );
}
