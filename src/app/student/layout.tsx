
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, User, Bookmark, Settings, MessageSquare, Menu, Bot, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

interface ProfileInfo {
  name: string;
  photoUrl: string | null;
}

const mobileNavItems = [
    { href: '/student', icon: Home, label: 'Home' },
    { href: '/student/apply', icon: Briefcase, label: 'Apply' },
    { href: '/student/saved', icon: Bookmark, label: 'Saved' },
    { href: '/student/profile', icon: User, label: 'Profile' },
];

const sidebarNavItems = [
    { href: '/student', icon: Home, label: 'Home' },
    { href: '/student/search', icon: Bot, label: 'AI Job Search' },
    { href: '/student/profile', icon: User, label: 'Resume Builder AI' },
    { href: '/student/notifications', icon: Bell, label: 'Notifications' },
    { href: '/student/saved', icon: Bookmark, label: 'Saved Jobs' },
    { href: '/student/settings', icon: Settings, label: 'Settings' },
    { href: '/student/feedback', icon: MessageSquare, label: 'Feedback' },
];


function SidebarContent() {
    const pathname = usePathname();
    const [profile, setProfile] = useState<ProfileInfo>({ name: 'User', photoUrl: null });

    useEffect(() => {
        try {
            const storedProfile = localStorage.getItem('userProfile');
            if (storedProfile) {
                const { data, photoPreview } = JSON.parse(storedProfile);
                setProfile({
                    name: data.firstName ? `${data.firstName} ${data.lastName}`.trim() : 'Anonymous User',
                    photoUrl: photoPreview
                });
            }
        } catch (error) {
            console.error("Error accessing localStorage:", error);
        }
    }, []);

    return (
         <div className="flex h-full flex-col">
            <div className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={profile.photoUrl || undefined} alt="Profile" />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg">{profile.name}</p>
                        <p className="text-sm text-muted-foreground">Student</p>
                    </div>
                </div>
            </div>
            <Separator />
            <nav className="flex-1 space-y-2 p-4">
                {sidebarNavItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary',
                        pathname === item.href && 'bg-muted text-primary'
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                </Link>
                ))}
            </nav>
        </div>
    )
}


export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <div className="grid min-h-dvh w-full md:grid-cols-[280px_1fr]">
       <aside className="hidden border-r bg-card md:block">
            <SidebarContent />
       </aside>
       <div className="flex flex-col">
           <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
              <Link href="/" className="flex items-center gap-2 text-primary font-bold">
                  <Briefcase className="h-6 w-6" />
                  <span className='hidden md:inline'>HireJacks</span>
              </Link>
              <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[280px]">
                       <SheetHeader>
                         <SheetTitle className="sr-only">Menu</SheetTitle>
                       </SheetHeader>
                       <SidebarContent />
                    </SheetContent>
                </Sheet>
              </div>
           </header>
           <main className="flex-1 overflow-y-auto bg-background pb-20 md:pb-0">
             {children}
           </main>
           <footer className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm md:hidden">
            <nav className="flex justify-around items-center h-16">
              {mobileNavItems.map((item) => (
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
    </div>
  );
}
