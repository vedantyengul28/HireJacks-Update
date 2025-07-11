
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, MapPin, Search as SearchIcon, Code, Bookmark } from 'lucide-react';
import { sampleJobs, type Job } from '@/lib/sample-data';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
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


export default function JobSearchPage() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    skills: '',
  });
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(sampleJobs);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const lowercasedKeyword = filters.keyword.toLowerCase();
    const lowercasedLocation = filters.location.toLowerCase();
    const lowercasedSkills = filters.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s);

    const results = sampleJobs.filter(job => {
      const titleMatch = job.title.toLowerCase().includes(lowercasedKeyword);
      const companyMatch = job.company.toLowerCase().includes(lowercasedKeyword);
      const descriptionMatch = job.description.toLowerCase().includes(lowercasedKeyword);
      const keywordMatch = titleMatch || companyMatch || descriptionMatch;

      const locationMatch = job.location.toLowerCase().includes(lowercasedLocation);

      const skillsMatch = lowercasedSkills.length === 0 || lowercasedSkills.every(skill => 
        job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skill))
      );

      return keywordMatch && locationMatch && skillsMatch;
    });

    setFilteredJobs(results);
  };
  
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

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Find Your Dream Job</CardTitle>
          <CardDescription>Search for jobs based on your skills and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="grid sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label htmlFor="keyword" className="text-sm font-medium">Keyword / Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="keyword" name="keyword" placeholder="e.g., Software Engineer" className="pl-10" value={filters.keyword} onChange={handleInputChange} />
              </div>
            </div>
             <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
               <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="location" name="location" placeholder="e.g., San Francisco" className="pl-10" value={filters.location} onChange={handleInputChange}/>
               </div>
            </div>
             <div className="space-y-2">
              <label htmlFor="skills" className="text-sm font-medium">Skills</label>
               <div className="relative">
                <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="skills" name="skills" placeholder="e.g., React, Node.js" className="pl-10" value={filters.skills} onChange={handleInputChange}/>
               </div>
            </div>
            <Button type="submit" className="sm:col-span-3">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search Jobs
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
         <h2 className="text-2xl font-bold tracking-tight">
            {filteredJobs.length} Job Openings
        </h2>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onSave={handleSaveJob} />
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
