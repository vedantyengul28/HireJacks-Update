
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { sampleJobs, type Job } from '@/lib/sample-data';
import { ArrowUp, Briefcase, MapPin, Bookmark, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const TOTAL_FIELDS = 7; // firstName, lastName, email, headline, summary, resume, photo

function ProfileCompletionCard() {
    const [completion, setCompletion] = useState(0);
    const [missingDetails, setMissingDetails] = useState(TOTAL_FIELDS);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        try {
            const storedProfile = localStorage.getItem('userProfile');
            if (storedProfile && isMounted) {
                const profile = JSON.parse(storedProfile);
                let filledFields = 0;
                if (profile.data?.firstName) filledFields++;
                if (profile.data?.lastName) filledFields++;
                if (profile.data?.email) filledFields++;
                if (profile.data?.headline) filledFields++;
                if (profile.data?.summary) filledFields++;
                if (profile.resumeFile) filledFields++;
                if (profile.profilePhoto) filledFields++;

                const newCompletion = Math.round((filledFields / TOTAL_FIELDS) * 100);
                setCompletion(newCompletion);
                setMissingDetails(TOTAL_FIELDS - filledFields);
                
                if (profile.timestamp) {
                    setLastUpdated(formatDistanceToNow(new Date(profile.timestamp), { addSuffix: true }));
                }
            }
        } catch (error) {
            console.error("Error accessing localStorage:", error);
        }
        return () => { isMounted = false; };
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
                             {missingDetails > 0 && completion < 100 && (
                                <Link href="/student/profile" className="text-sm text-primary font-medium hover:underline">
                                    {missingDetails} missing detail{missingDetails > 1 ? 's' : ''}
                                </Link>
                             )}
                             {completion === 100 && (
                                <p className="text-sm font-medium text-green-500">Profile complete!</p>
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
                        <p className="flex items-center gap-1 text-sm font-semibold text-green-500">
                            <ArrowUp className="h-4 w-4"/>
                            Boost your visibility
                        </p>
                        <p className="text-xs text-muted-foreground">Complete your profile to get seen by recruiters.</p>
                     </div>
                     {completion < 100 && (
                        <Link href="/student/profile">
                            <Button variant="outline" size="sm">Add Details</Button>
                        </Link>
                     )}
                </div>
            </CardContent>
        </Card>
    );
}

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

function RecentJobsFeed() {
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadData = () => {
        try {
            const storedJobs = localStorage.getItem('allJobs');
            const jobs = storedJobs ? JSON.parse(storedJobs) : sampleJobs;
            
            const storedAppliedJobs = localStorage.getItem('appliedJobs');
            const applied = storedAppliedJobs ? JSON.parse(storedAppliedJobs) : [];
            
            const storedSavedJobs = localStorage.getItem('savedJobs');
            const saved = storedSavedJobs ? JSON.parse(storedSavedJobs).map((j: Job) => j.id) : [];
            
            if (isMounted) {
                setAllJobs(jobs);
                if (!storedJobs) localStorage.setItem('allJobs', JSON.stringify(sampleJobs));
                setAppliedJobs(applied);
                setSavedJobs(saved);
            }
        } catch (error) {
            console.error("Error accessing localStorage:", error);
            if (isMounted) setAllJobs(sampleJobs);
        }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);


  const handleSaveJob = (jobToSave: Job) => {
    let currentSavedJobs: Job[] = [];
    try {
      currentSavedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    } catch (e) { console.error(e) }
    
    const isAlreadySaved = currentSavedJobs.some(job => job.id === jobToSave.id);
    let updatedSavedJobs;

    if (isAlreadySaved) {
      updatedSavedJobs = currentSavedJobs.filter(job => job.id !== jobToSave.id);
      toast({
        variant: "destructive",
        title: "Job Unsaved",
        description: `${jobToSave.title} at ${jobToSave.organization} has been removed.`
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
  
   const addNotification = (newNotification: {title: string; description: string;}) => {
    try {
        const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notification = {
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
    
    const hasAlreadyApplied = applications.some((app: any) => app.jobId === jobId && app.applicantProfile?.data?.email === userProfile?.data?.email);

    if (!hasAlreadyApplied) {
      applications.push({ jobId, applicantProfile: userProfile });
      localStorage.setItem('applications', JSON.stringify(applications));
    }
    
    const job = allJobs.find(p => p.id === jobId);
    if (job) {
        toast({
            title: "Application Sent!",
            description: `You successfully applied for the ${job.title} position.`
        });
        addNotification({
            title: "Application Sent!",
            description: `You applied for ${job.title} at ${job.organization}.`
        });
    }
  };
  
  const jobsToDisplay = allJobs.slice().reverse().slice(0, 5);

  return (
    <div className="space-y-4">
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl font-bold tracking-tight">Recent Jobs</h2>
        <Link href="/student/apply">
          <Button variant="link">View all</Button>
        </Link>
      </div>

      {jobsToDisplay.length > 0 ? (
        <div className="space-y-4">
          {jobsToDisplay.map(job => (
            <JobCard key={job.id} job={job} onSave={handleSaveJob} onApply={handleApply} isApplied={appliedJobs.includes(job.id)} isSaved={savedJobs.includes(job.id)} />
          ))}
        </div>
      ) : (
         <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">No recent jobs found.</p>
            <p className="text-sm text-muted-foreground">Check back later for new opportunities.</p>
          </div>
      )}
    </div>
  );
}

export default function StudentPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <ProfileCompletionCard />
      <RecentJobsFeed />
    </div>
  );
}
