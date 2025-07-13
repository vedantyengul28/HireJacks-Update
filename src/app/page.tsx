
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Briefcase,
  Menu,
} from 'lucide-react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const sidebarLinks = [
  { href: '/roles', label: 'Get Started' },
  { href: '/student/search', label: 'Search Projects' },
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
        <main className="flex flex-1 items-center justify-center p-4 text-center">
          <div className="flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto">
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
