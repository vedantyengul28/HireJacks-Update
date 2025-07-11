import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function IntroductionPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 sm:p-6 text-center">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tight">
          Welcome to HireJacks
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground">
          The seamless platform to connect skilled professionals with innovative companies. Your next opportunity is just a click away.
        </p>
        <Link href="/roles">
          <Button size="lg" className="group transform transition-transform duration-300 hover:scale-105">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
