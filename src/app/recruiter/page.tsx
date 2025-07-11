
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sampleJobs, type Job } from '@/lib/sample-data';

export default function RecruiterPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [jobDetails, setJobDetails] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract',
    salary: '',
    description: '',
    skills: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setJobDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: 'Full-time' | 'Part-time' | 'Contract') => {
    setJobDetails(prev => ({ ...prev, type: value }));
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    const allJobs: Job[] = JSON.parse(localStorage.getItem('allJobs') || JSON.stringify(sampleJobs));
    
    const newJob: Job = {
      id: allJobs.length + 1,
      title: jobDetails.title,
      company: jobDetails.company,
      location: jobDetails.location,
      type: jobDetails.type,
      description: jobDetails.description,
      skills: jobDetails.skills.split(',').map(s => s.trim()),
      salary: jobDetails.salary,
    };

    const updatedJobs = [...allJobs, newJob];
    localStorage.setItem('allJobs', JSON.stringify(updatedJobs));

    toast({
      title: 'Job Posted Successfully!',
      description: `${newJob.title} at ${newJob.company} is now live.`,
    });

    // Reset form and hide it
    setJobDetails({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: '',
        skills: '',
    });
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Recruiter Dashboard
          </CardTitle>
          <CardDescription>
            Manage your job postings and connect with top talent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" value={jobDetails.title} onChange={handleInputChange} placeholder="e.g., Senior Developer" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" value={jobDetails.company} onChange={handleInputChange} placeholder="e.g., TechCorp" required />
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
                    <Label htmlFor="salary">Salary / Rate</Label>
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
                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button type="submit">Post Job</Button>
               </div>
            </form>
          ) : (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Create a New Job Posting</h3>
              <p className="text-muted-foreground mb-4">You can post a new job to attract candidates.</p>
              <Button onClick={() => setShowForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Post a Job
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    