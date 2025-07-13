
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Check, Bookmark } from 'lucide-react';
import { sampleJobs, type Job } from '@/lib/sample-data';
import { useToast } from '@/hooks/use-toast';
import type { Notification } from '../notifications/page';
import BackButton from '@/components/ui/back-button';

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

export default function ApplyJobsPage() {
  const { toast } = useToast();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedJobs = localStorage.getItem('allJobs');
      const jobs = storedJobs ? JSON.parse(storedJobs) : sampleJobs;
      setAllJobs(jobs.slice().reverse());

      const storedAppliedJobs = localStorage.getItem('appliedJobs');
      if (storedAppliedJobs) {
        setAppliedJobs(JSON.parse(storedAppliedJobs));
      }

      const storedSavedJobs = localStorage.getItem('savedJobs');
      if (storedSavedJobs) {
        setSavedJobs(JSON.parse(storedSavedJobs).map((p: Job) => p.id));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setAllJobs(sampleJobs.slice().reverse());
    }
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
  
  const addNotification = (newNotification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    try {
        const existingNotifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notification: Notification = {
            ...newNotification,
            id: new Date().toISOString(),
            timestamp: new Date().toISOString(),
            read: false,
        };
        const updatedNotifications = [...existingNotifications, notification];
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
        console.error("Failed to add notification:", error);
    }
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
       addNotification({
        title: "Application Sent!",
        description: `You successfully applied for the ${job.title} position at ${job.organization}.`
       });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <BackButton />
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Apply for Jobs</CardTitle>
          <CardDescription>
            Browse and apply for all available jobs. Found {allJobs.length} opening{allJobs.length !== 1 && 's'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {allJobs.length > 0 ? (
            allJobs.map(job => (
              <JobCard key={job.id} job={job} onSave={handleSaveJob} onApply={handleApply} isApplied={appliedJobs.includes(job.id)} isSaved={savedJobs.includes(job.id)} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Job Openings</h3>
              <p className="text-muted-foreground">There are currently no jobs available. Please check back later.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
