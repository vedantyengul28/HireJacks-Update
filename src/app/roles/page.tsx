import Link from 'next/link';
import { Briefcase, UserSearch } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RoleSelectionPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 sm:p-6">
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
        <Link href="/job-seeker">
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
  );
}
