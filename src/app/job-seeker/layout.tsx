
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, User, Settings, Star, Bot, MessageSquare, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface ProfileData {
  firstName: string;
  lastName: string;
}

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const { data, photoPreview } = JSON.parse(storedProfile);
      setProfileData(data);
      if (photoPreview) setProfilePhotoPreview(photoPreview);
    }
  }, [pathname]); // Rerun on navigation to update if profile changes

  const navItems = [
    { href: '/job-seeker', icon: Home, label: 'Home' },
    { href: '/job-seeker/search', icon: Bot, label: 'AI Job Recommendation' },
    { href: '/job-seeker/profile', icon: User, label: 'Resume Builder AI' },
    { href: '/job-seeker/saved', icon: Star, label: 'Saved Jobs' },
    { href: '/job-seeker/settings', icon: Settings, label: 'Settings' },
    { href: '/job-seeker/feedback', icon: MessageSquare, label: 'Feedback' },
  ];
  
  const NavLinks = () => (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary',
            (pathname === item.href || (item.href !== '/job-seeker' && pathname.startsWith(item.href))) && 'bg-muted text-primary'
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  const MobileNav = () => (
     <footer className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm md:hidden">
        <nav className="flex justify-around items-center h-16">
          {navItems.slice(0, 4).map((item) => ( // Show first 4 items on mobile
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full text-muted-foreground transition-colors hover:text-primary',
                (pathname === item.href || (item.href !== '/job-seeker' && pathname.startsWith(item.href))) && 'text-primary'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium text-center">{item.label.split(' ')[0]}</span>
            </Link>
          ))}
        </nav>
      </footer>
  );
  
  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4 py-4">
      <div className="flex items-center gap-3 px-4">
          <Avatar className="h-12 w-12">
              <AvatarImage src={profilePhotoPreview || undefined} alt="Profile Photo" />
              <AvatarFallback>
                  <User />
              </AvatarFallback>
          </Avatar>
          <div>
              <p className="text-lg font-semibold">
                  {profileData?.firstName || 'Welcome,'} {profileData?.lastName}
              </p>
              <Link href="/job-seeker/profile" className="text-sm text-primary hover:underline">View Profile</Link>
          </div>
      </div>
      <div className="flex-1 px-4">
        <NavLinks />
      </div>
    </div>
  );

  return (
    <div className="grid min-h-dvh w-full md:grid-cols-[280px_1fr]">
       <div className="hidden border-r bg-card md:block">
         <SidebarContent />
       </div>
       <div className="flex flex-col">
          <header className="flex h-16 items-center gap-4 border-b bg-card px-6 md:px-6">
              <Link href="/" className="flex items-center gap-2 text-primary">
                  <Briefcase className="h-6 w-6" />
                  <h1 className="text-xl font-bold">HireJacks</h1>
              </Link>
               <div className="md:hidden ml-auto">
                 <Sheet>
                   <SheetTrigger asChild>
                     <Button variant="outline" size="icon">
                       <Menu className="h-6 w-6" />
                       <span className="sr-only">Toggle Menu</span>
                     </Button>
                   </SheetTrigger>
                   <SheetContent side="left" className="p-0">
                     <SidebarContent />
                   </SheetContent>
                 </Sheet>
               </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-background pb-20 md:pb-0">
            {children}
          </main>
          <MobileNav />
       </div>
    </div>
  );
}
