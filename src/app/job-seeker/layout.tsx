
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, User, Bell, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/job-seeker', icon: Home, label: 'Home' },
    { href: '/job-seeker/apply', icon: Briefcase, label: 'Apply Jobs' },
    { href: '/job-seeker/profile', icon: User, label: 'Profile' },
    { href: '/job-seeker/notifications', icon: Bell, label: 'Notifications' },
  ];
  
  return (
    <div className="flex min-h-dvh flex-col">
       <header className="flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6 sticky top-0 z-10">
          <Link href="/" className="flex items-center gap-2 text-primary">
              <Briefcase className="h-6 w-6" />
              <h1 className="text-xl font-bold">HireJacks</h1>
          </Link>
       </header>
       <main className="flex-1 overflow-y-auto bg-background pb-20">
         {children}
       </main>
       <footer className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full text-muted-foreground transition-colors hover:text-primary',
                (pathname === item.href) && 'text-primary'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium text-center">{item.label}</span>
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
