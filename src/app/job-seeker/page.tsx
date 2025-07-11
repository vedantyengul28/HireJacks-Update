
'use client';

import { handleSuggestJobs } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { sampleJobs, type Job } from '@/lib/sample-data';
import { ArrowUp, Briefcase, Loader2, MapPin, Bookmark } from 'lucide-react';
import { useEffect, useState, useActionState, useTransition } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const TOTAL_FIELDS = 7; // firstName, lastName, email, headline, summary, resume, photo

function ProfileCompletionCard() {
    const [completion, setCompletion] = useState(0);
    const [missingDetails, setMissingDetails] = useState(TOTAL_FIELDS);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            let filledFields = 0;
            if (profile.data.firstName) filledFields++;
            if (profile.data.lastName) filledFields++;
            if (profile.data.email) filledFields++;
            if (profile.data.headline) filledFields++;
            if (profile.data.summary) filledFields++;
            if (profile.resumeFile) filledFields++;
            if (profile.profilePhoto) filledFields++;

            const newCompletion = Math.round((filledFields / TOTAL_FIELDS) * 100);
            setCompletion(newCompletion);
            setMissingDetails(TOTAL_FIELDS - filledFields);
            
            if (profile.timestamp) {
                setLastUpdated(formatDistanceToNow(new Date(profile.timestamp), { addSuffix: true }));
            }
        }
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
                            <p className="text-xs text-muted-foreground">
                                {lastUpdated ? `Updated ${lastUpdated}` : 'Not updated yet'}
                            </p>
                             {missingDetails > 0 && (
                                <Link href="/job-seeker/profile" className="text-sm text-primary font-medium">
                                    {missingDetails} missing detail{missingDetails > 1 ? 's' : ''}
                                </Link>
                             )}
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

function JobCard({ job, onSave }: { job: Job; onSave: (job: Job) => void; }) {
  const { toast } = useToast();

  const handleApply = () => {
    toast({
        title: "Application Sent!",
        description: `You successfully applied for the ${job.title} position at ${job.company}.`
    });
  }

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
             <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onSave(job)}>
                    <Bookmark className="h-4 w-4" />
                    <span className="sr-only">Save Job</span>
                </Button>
                <Button size="sm" onClick={handleApply}>Apply Now</Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AiJobFeed() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(handleSuggestJobs, { message: '', jobs: [] });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const profileSummary = "Experienced frontend developer proficient in React, TypeScript, and Next.js. Passionate about building accessible user interfaces and working with modern web technologies. Skilled in state management with Redux and Zustand, and building design systems with Tailwind CSS.";

  useEffect(() => {
    if (!submitted) {
        const formData = new FormData();
        formData.append('profile', profileSummary);
        startTransition(() => {
            formAction(formData);
        });
        setSubmitted(true);
    }
  }, [submitted, formAction, profileSummary]);

  const handleSaveJob = (jobToSave: Job) => {
    const savedJobs: Job[] = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isAlreadySaved = savedJobs.some(job => job.id === jobToSave.id);
    if (!isAlreadySaved) {
        localStorage.setItem('savedJobs', JSON.stringify([...savedJobs, jobToSave]));
        toast({
            title: "Job Saved!",
            description: `${jobToSave.title} at ${jobToSave.company} has been saved.`
        });
    } else {
        toast({
            variant: "default",
            title: "Already Saved",
            description: `This job is already in your saved list.`
        });
    }
  };

  const pending = isPending || (submitted && !state.jobs?.length && !state.message.startsWith('No'));
  const suggestedJobs = sampleJobs.filter(job => state.jobs?.some(suggestion => job.title.toLowerCase().includes(suggestion.toLowerCase().split(' ')[1] || '')));


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
            <JobCard key={job.id} job={job} onSave={handleSaveJob} />
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
