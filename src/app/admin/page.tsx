
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Briefcase, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sampleJobs, type Job } from '@/lib/sample-data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import BackButton from '@/components/ui/back-button';
import type { Notification } from '../student/notifications/page';


export default function AdminPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [jobDetails, setJobDetails] = useState({
    title: '',
    organization: '',
    location: '',
    type: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract',
    salary: '',
    description: '',
    skills: '',
  });

  useEffect(() => {
    try {
        const allJobsString = localStorage.getItem('allJobs');
        if (allJobsString) {
            const allJobs: Job[] = JSON.parse(allJobsString);
            setPostedJobs(allJobs);
        } else {
            const initialJobs = sampleJobs;
            setPostedJobs(initialJobs);
            localStorage.setItem('allJobs', JSON.stringify(initialJobs));
        }
    } catch(e) {
        console.error(e);
        setPostedJobs(sampleJobs);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setJobDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: 'Full-time' | 'Part-time' | 'Contract') => {
    setJobDetails(prev => ({ ...prev, type: value }));
  };

  const resetForm = () => {
    setJobDetails({
        title: '',
        organization: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: '',
        skills: '',
    });
    setEditingJob(null);
    setShowForm(false);
  }
  
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

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    let allJobs: Job[] = [];
    try {
       const storedJobs = localStorage.getItem('allJobs');
       allJobs = storedJobs ? JSON.parse(storedJobs) : [];
    } catch (e) {
        console.error(e)
    }

    if (editingJob) {
        // Update existing job
        const updatedJob = {
            ...editingJob,
            ...jobDetails,
            skills: jobDetails.skills.split(',').map(s => s.trim()),
        };
        allJobs = allJobs.map(job => job.id === editingJob.id ? updatedJob : job);
        toast({ title: 'Job Updated!', description: 'Your job posting has been successfully updated.' });
    } else {
        // Create new job
        const newJob: Job = {
            id: allJobs.length > 0 ? Math.max(...allJobs.map(p => p.id)) + 1 : 1,
            ...jobDetails,
            skills: jobDetails.skills.split(',').map(s => s.trim()),
        };
        allJobs.push(newJob);
        toast({ title: 'Job Posted!', description: `${newJob.title} at ${newJob.organization} is now live.` });
        addNotification({
            title: 'New Job Posted!',
            description: `A new job "${newJob.title}" from ${newJob.organization} is available.`
        });
    }

    localStorage.setItem('allJobs', JSON.stringify(allJobs));
    setPostedJobs(allJobs);
    resetForm();
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setJobDetails({
        ...job,
        skills: job.skills.join(', '),
    });
    setShowForm(true);
  };
  
  const handleDeleteJob = (jobId: number) => {
     let allJobs: Job[] = [];
      try {
        const storedJobs = localStorage.getItem('allJobs');
        allJobs = storedJobs ? JSON.parse(storedJobs) : [];
      } catch(e) {
        console.error(e)
      }
     allJobs = allJobs.filter(job => job.id !== jobId);
     localStorage.setItem('allJobs', JSON.stringify(allJobs));
     setPostedJobs(allJobs);
     toast({ variant: 'destructive', title: 'Job Deleted', description: 'The job posting has been removed.' });
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <BackButton />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Admin Dashboard
          </CardTitle>
          <CardDescription>
            Manage your job postings and connect with top talent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <form onSubmit={handlePostJob} className="space-y-4">
               <h3 className="text-lg font-semibold">{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" value={jobDetails.title} onChange={handleInputChange} placeholder="e.g., Senior Developer" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Name</Label>
                  <Input id="organization" value={jobDetails.organization} onChange={handleInputChange} placeholder="e.g., TechCorp" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={jobDetails.location} onChange={handleInputChange} placeholder="e.g., San Francisco, CA" required />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="type">Job Type</Label>
                    <Select value={jobDetails.type} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
              </div>
               <div className="space-y-2">
                    <Label htmlFor="salary">Stipend / Rate</Label>
                    <Input id="salary" value={jobDetails.salary} onChange={handleInputChange} placeholder="e.g., $120,000 - $160,000" required />
               </div>
               <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input id="skills" value={jobDetails.skills} onChange={handleInputChange} placeholder="e.g., React, TypeScript, Node.js" required />
               </div>
               <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea id="description" value={jobDetails.description} onChange={handleInputChange} placeholder="Describe the role and responsibilities..." rows={5} required />
               </div>
               <div className="flex gap-2 justify-end">
                    <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                    <Button type="submit">{editingJob ? 'Update Job' : 'Post Job'}</Button>
               </div>
            </form>
          ) : (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Your Job Postings ({postedJobs.length})</h3>
                    <Button onClick={() => setShowForm(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post a New Job
                    </Button>
                </div>
                {postedJobs.length > 0 ? (
                    <div className="space-y-4">
                        {postedJobs.slice().reverse().map(job => (
                            <Card key={job.id} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold">{job.title}</h4>
                                        <p className="text-sm text-muted-foreground">{job.organization} - {job.location}</p>
                                    </div>
                                    <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>{job.type}</Badge>
                                </div>
                                <Separator className="my-3"/>
                                <div className="flex justify-end gap-2">
                                     <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}><Edit className="mr-2 h-3 w-3"/> Edit</Button>
                                     <Button variant="destructive" size="sm" onClick={() => handleDeleteJob(job.id)}><Trash2 className="mr-2 h-3 w-3"/> Delete</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Jobs Posted Yet</h3>
                        <p className="text-muted-foreground mb-4">Post a job to attract candidates.</p>
                    </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
