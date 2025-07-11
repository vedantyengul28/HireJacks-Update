
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Trash2, Check } from 'lucide-react';
import { type Job } from '@/lib/sample-data';
import { useToast } from '@/hooks/use-toast';

function SavedJobCard({ job, onRemove, onApply, isApplied }: { job: Job, onRemove: (jobId: number) => void, onApply: (jobId: number) => void, isApplied: boolean }) {

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
             <div className='flex items-center gap-2'>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onRemove(job.id)}>
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Remove Job</span>
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


export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const jobsFromStorage = localStorage.getItem('savedJobs');
    if (jobsFromStorage) {
      setSavedJobs(JSON.parse(jobsFromStorage));
    }
    const appliedFromStorage = localStorage.getItem('appliedJobs');
    if (appliedFromStorage) {
      setAppliedJobs(JSON.parse(appliedFromStorage));
    }
  }, []);

  const handleRemoveJob = (jobId: number) => {
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
    toast({
        variant: "destructive",
        title: "Job Removed",
        description: "The job has been removed from your saved list."
    });
  }

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

    const job = savedJobs.find(j => j.id === jobId);
     if (job) {
        toast({
            title: "Application Sent!",
            description: `You successfully applied for the ${job.title} position at ${job.company}.`
        });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className='flex items-center gap-4'>
            <Star className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="text-2xl font-bold tracking-tight">Saved Jobs</CardTitle>
                <CardDescription>
                    The jobs you save will appear here. Found {savedJobs.length} job{savedJobs.length !== 1 && 's'}.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {savedJobs.length > 0 ? (
                <div className="space-y-4">
                    {savedJobs.map(job => (
                        <SavedJobCard key={job.id} job={job} onRemove={handleRemoveJob} onApply={handleApply} isApplied={appliedJobs.includes(job.id)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Star className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                    <h3 className="text-xl font-semibold mb-2">No Saved Jobs Yet</h3>
                    <p className="text-muted-foreground">Start searching and save jobs you're interested in.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
