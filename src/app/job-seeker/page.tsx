
'use client';

import { handleSuggestJobs } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { sampleJobs, type Job } from '@/lib/sample-data';
import { ArrowUp, Briefcase, FileText, Link as LinkIcon, Loader2, MapPin, Sparkles } from 'lucide-react';
import { useEffect, useState, useActionState } from 'react';
import Link from 'next/link';

function ProfileCompletionCard() {
    const [completion, setCompletion] = useState(0);

    useEffect(() => {
        // Simulate fetching profile completion
        const timer = setTimeout(() => setCompletion(73), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="hsl(var(--secondary))"
                                    strokeWidth="3"
                                />
                                <path
                                    className="transition-all duration-500"
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="3"
                                    strokeDasharray={`${completion}, 100`}
                                />
                            </svg>
                             <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                                {completion}%
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold">Your Profile</p>
                            <p className="text-xs text-muted-foreground">Updated 34d ago</p>
                            <Link href="/job-seeker/profile" className="text-sm text-primary font-medium">5 missing details</Link>
                        </div>
                    </div>
                     <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-xs text-muted-foreground">Search appearances</p>
                        <p className="text-xs text-muted-foreground">Last 90 days</p>
                    </div>
                </div>
                <Separator className="my-4"/>
                <div className='flex justify-between items-center'>
                     <div>
                        <p className="flex items-center gap-1 text-sm font-semibold text-green-600">
                            <ArrowUp className="h-4 w-4"/>
                            Boost 2%
                        </p>
                        <p className="text-xs text-muted-foreground">Personal details help recruiters know more about you.</p>
                     </div>
                     <Link href="/job-seeker/profile">
                        <Button variant="outline" size="sm">Add Details</Button>
                     </Link>
                </div>
            </CardContent>
        </Card>
    );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription className="font-medium text-primary">{job.company}</CardDescription>
            </div>
            <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>{job.type}</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground pt-2">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{job.location}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.map(skill => <Badge variant="outline" key={skill}>{skill}</Badge>)}
        </div>
        <div className="flex justify-between items-center">
             <p className="text-sm font-semibold">{job.salary}</p>
            <Button size="sm">Apply Now</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AiJobFeed() {
  const [state, formAction] = useActionState(handleSuggestJobs, { message: '', jobs: [] });
  const [submitted, setSubmitted] = useState(false);

  // Example profile summary. In a real app, this would come from the user's saved profile.
  const profileSummary = "Experienced frontend developer proficient in React, TypeScript, and Next.js. Passionate about building accessible user interfaces and working with modern web technologies. Skilled in state management with Redux and Zustand, and building design systems with Tailwind CSS.";

  useEffect(() => {
    // Automatically submit the form on component mount if not already submitted
    if (!submitted) {
        const formData = new FormData();
        formData.append('profile', profileSummary);
        formAction(formData);
        setSubmitted(true);
    }
  }, [submitted, formAction, profileSummary]);

  const { pending } = { pending: submitted && !state.jobs?.length && !state.message.startsWith('No') };
  const suggestedJobs = sampleJobs.filter(job => state.jobs?.some(suggestion => job.title.includes(suggestion.split(' ')[1])));


  return (
    <div className="space-y-4">
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl font-bold tracking-tight">Jobs based on your profile</h2>
        <Link href="/job-seeker/search">
          <Button variant="link">View all</Button>
        </Link>
      </div>

      {pending && (
        <div className="flex items-center justify-center p-8 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-muted-foreground">Finding jobs for you...</p>
        </div>
      )}

      {!pending && suggestedJobs.length > 0 && (
        <div className="space-y-4">
          {suggestedJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {!pending && suggestedJobs.length === 0 && (
         <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">No recommended jobs found at the moment.</p>
            <p className="text-sm text-muted-foreground">Try enhancing your profile for better matches.</p>
          </div>
      )}
    </div>
  );
}

export default function JobSeekerPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <ProfileCompletionCard />
      <AiJobFeed />
    </div>
  );
}
