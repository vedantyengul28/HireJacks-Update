
'use client';

import { useState, useEffect, useActionState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Briefcase, MapPin, Bookmark, Check, Bot, Loader2, AlertCircle } from 'lucide-react';
import { sampleJobs, type Job } from '@/lib/sample-data';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import { handleSuggestJobs } from '@/app/actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


function JobCard({ job, onSave, onApply, isApplied, isSaved }: { job: Job; onSave: (job: Job) => void; onApply: (jobId: number) => void; isApplied: boolean; isSaved: boolean; }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription className="font-medium text-primary">{job.organization}</CardDescription>
            </div>
            <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>{job.type}</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground pt-2">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{job.location}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.map(skill => <Badge variant="outline" key={skill}>{skill}</Badge>)}
        </div>
        <div className="flex justify-between items-center">
             <p className="text-sm font-semibold">{job.salary}</p>
             <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onSave(job)}>
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    <span className="sr-only">Save Job</span>
                </Button>
                {isApplied ? (
                    <Button size="sm" disabled>
                        <Check className="mr-2 h-4 w-4" />
                        Applied
                    </Button>
                ) : (
                    <Button size="sm" onClick={() => onApply(job.id)}>Apply Now</Button>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AiJobSearchPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(handleSuggestJobs, { message: '', jobs: [] });
  
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [profileSummary, setProfileSummary] = useState('');

  useEffect(() => {
    let isMounted = true;
    try {
        const storedJobs = localStorage.getItem('allJobs');
        const jobs = storedJobs ? JSON.parse(storedJobs) : sampleJobs;

        const storedAppliedJobs = localStorage.getItem('appliedJobs');
        const applied = storedAppliedJobs ? JSON.parse(storedAppliedJobs) : [];
        
        const storedSavedJobs = localStorage.getItem('savedJobs');
        const saved = storedSavedJobs ? JSON.parse(storedSavedJobs).map((j: Job) => j.id) : [];

        const userProfileData = localStorage.getItem('userProfile');
        const profile = userProfileData ? JSON.parse(userProfileData) : {};
        const summary = profile.data?.summary || "";
        
        if(isMounted) {
            setAllJobs(jobs);
            setAppliedJobs(applied);
            setSavedJobs(saved);
            setProfileSummary(summary);
        }
    } catch(error) {
        console.error("Error accessing localStorage:", error);
        if(isMounted) {
            setAllJobs(sampleJobs);
            setProfileSummary("I am a frontend developer with experience in React and TypeScript.");
        }
    }
    return () => { isMounted = false; };
  }, []);

  const handleSaveJob = (jobToSave: Job) => {
    let currentSavedJobs: Job[] = [];
    try {
        currentSavedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    } catch (e) {
        console.error(e)
    }

    const isAlreadySaved = currentSavedJobs.some(job => job.id === jobToSave.id);
    let updatedSavedJobs;

    if (isAlreadySaved) {
        updatedSavedJobs = currentSavedJobs.filter(job => job.id !== jobToSave.id);
        toast({
            variant: "destructive",
            title: "Job Unsaved",
            description: `${jobToSave.title} at ${jobToSave.organization} has been removed from your list.`
        });
    } else {
        updatedSavedJobs = [...currentSavedJobs, jobToSave];
        toast({
            title: "Job Saved!",
            description: `${jobToSave.title} at ${jobToSave.organization} has been saved.`
        });
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    setSavedJobs(updatedSavedJobs.map(p => p.id));
  };
  
  const handleApply = (jobId: number) => {
    const updatedAppliedJobs = [...appliedJobs, jobId];
    setAppliedJobs(updatedAppliedJobs);
    localStorage.setItem('appliedJobs', JSON.stringify(updatedAppliedJobs));

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    const hasAlreadyApplied = applications.some((app: any) => app.jobId === jobId && app.applicantProfile.data.email === userProfile.data.email);

    if (!hasAlreadyApplied) {
      applications.push({ jobId, applicantProfile: userProfile });
      localStorage.setItem('applications', JSON.stringify(applications));
    }
    
    const job = allJobs.find(p => p.id === jobId);
    if (job) {
        toast({
            title: "Application Sent!",
            description: `You successfully applied for the ${job.title} position at ${job.organization}.`
        });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profile', profileSummary);
    startTransition(() => {
        formAction(formData);
    });
  }

  const suggestedJobs = state.jobs && state.jobs.length > 0
    ? allJobs.filter(job => state.jobs?.some(suggestion => 
        job.title.toLowerCase().includes(suggestion.toLowerCase().split(' ').slice(0, 2).join(' '))))
    : [];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <BackButton />
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                AI Job Search
            </CardTitle>
            <CardDescription>Describe your skills and experience, and our AI will find the best jobs for you. We've pre-filled this from your profile summary.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Textarea
                placeholder="e.g., I'm a full-stack developer with 3 years of experience in React, Node.js, and cloud services..."
                rows={5}
                value={profileSummary}
                onChange={(e) => setProfileSummary(e.target.value)}
                className="resize-none"
              />
              {state.issues && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {state.issues.join(' ')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending || !profileSummary}>
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Bot className="mr-2 h-4 w-4" />
                )}
                Get AI Recommendations
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="space-y-6">
          {state.jobs && state.jobs.length > 0 && (
            <h2 className="text-2xl font-bold tracking-tight">
              {suggestedJobs.length} Suggested Job{suggestedJobs.length !== 1 && 's'}
            </h2>
          )}
          
          {isPending && (
            <div className="flex items-center justify-center p-8 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Finding jobs for you...</p>
            </div>
          )}

          {!isPending && suggestedJobs.length > 0 && (
            suggestedJobs.map(job => (
              <JobCard key={job.id} job={job} onSave={handleSaveJob} onApply={handleApply} isApplied={appliedJobs.includes(job.id)} isSaved={savedJobs.includes(job.id)} />
            ))
          )}

          {!isPending && state.jobs && suggestedJobs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No jobs found matching your profile.</p>
              <p className="text-sm text-muted-foreground">Try refining your summary for better results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
