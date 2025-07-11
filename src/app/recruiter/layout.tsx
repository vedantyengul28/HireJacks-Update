
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusSquare, Users, BarChart3, Briefcase, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/recruiter', icon: PlusSquare, label: 'Post Job' },
    { href: '/recruiter/applicants', icon: Users, label: 'Applicants' },
    { href: '/recruiter/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  if (pathname.includes('/login')) {
     return <main className="flex-1 bg-background">{children}</main>;
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between p-4 border-b bg-card">
         <Link href="/" className="flex items-center gap-2 text-accent">
          <Briefcase className="h-6 w-6" />
          <h1 className="text-xl font-bold">HireJacks Recruiter</h1>
        </Link>
        <Button asChild variant="outline" size="sm">
            <Link href="/recruiter/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
            </Link>
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto bg-background pb-20">
        {children}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = item.href === '/recruiter' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 w-full text-muted-foreground transition-colors hover:text-accent',
                  isActive && 'text-accent'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </footer>
    </div>
  );
}
