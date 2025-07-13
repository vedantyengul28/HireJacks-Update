
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, ChevronDown, ChevronUp, User, FileText, Mail, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Job } from '@/lib/sample-data';
import BackButton from '@/components/ui/back-button';

interface Application {
  jobId: number;
  applicantProfile: any;
}

interface GroupedApplications {
  [key: number]: {
    job: Job;
    applicants: any[];
  };
}

export default function AdminApplicantsPage() {
  const [groupedApps, setGroupedApps] = useState<GroupedApplications>({});
  const [openJobs, setOpenJobs] = useState<number[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);

  useEffect(() => {
    try {
      const allJobs: Job[] = JSON.parse(localStorage.getItem('allJobs') || '[]');
      const applications: Application[] = JSON.parse(localStorage.getItem('applications') || '[]');

      const grouped: GroupedApplications = {};

      applications.forEach(app => {
        const job = allJobs.find(p => p.id === app.jobId);
        if (job) {
          if (!grouped[app.jobId]) {
            grouped[app.jobId] = { job, applicants: [] };
          }
          grouped[app.jobId].applicants.push(app.applicantProfile);
        }
      });

      setGroupedApps(grouped);
      setOpenJobs(Object.keys(grouped).map(Number));
    } catch (error) {
      console.error("Error processing application data:", error);
    }
  }, []);

  const toggleJob = (jobId: number) => {
    setOpenJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };
  
  const totalApplicants = Object.values(groupedApps).reduce((sum, group) => sum + group.applicants.length, 0);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <BackButton />
       <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-accent" />
              <div>
                 <CardTitle className="text-2xl font-bold tracking-tight">
                    Manage Applicants
                 </CardTitle>
                 <CardDescription>
                    {totalApplicants > 0 ? `You have ${totalApplicants} applicant(s) across ${Object.keys(groupedApps).length} job(s).` : 'No applicants yet.'}
                 </CardDescription>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedApps).length > 0 ? (
            <div className="space-y-4">
              {Object.values(groupedApps).map(({ job, applicants }) => (
                <Card key={job.id} className="overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleJob(job.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-6 w-6 text-accent" />
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {applicants.length} applicant{applicants.length !== 1 && 's'}
                        </p>
                      </div>
                    </div>
                    {openJobs.includes(job.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                  {openJobs.includes(job.id) && (
                    <div className="p-4 border-t">
                        {applicants.length > 0 ? (
                             <ul className="space-y-3">
                                {applicants.map((applicant, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 rounded-md bg-card border">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={applicant.photoPreview || undefined} />
                                                <AvatarFallback><User /></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{applicant.data.firstName} {applicant.data.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{applicant.data.headline}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => setSelectedApplicant(applicant)}>
                                            View Profile
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ): (
                             <p className="text-sm text-muted-foreground text-center py-4">No applicants for this job yet.</p>
                        )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Applicants Yet</h3>
                <p className="text-muted-foreground">Applicants for your jobs will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
       {selectedApplicant && (
        <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedApplicant.photoPreview} />
                  <AvatarFallback className="text-3xl"><User /></AvatarFallback>
                </Avatar>
                <div>
                   <DialogTitle className="text-2xl font-bold">{selectedApplicant.data.firstName} {selectedApplicant.data.lastName}</DialogTitle>
                   <DialogDescription className="text-base">{selectedApplicant.data.headline}</DialogDescription>
                   <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Mail className="w-4 h-4"/> {selectedApplicant.data.email}</div>
                        <a href="#" className="flex items-center gap-1.5 text-primary hover:underline"><Linkedin className="w-4 h-4"/> LinkedIn Profile</a>
                   </div>
                </div>
              </div>
            </DialogHeader>
            <Separator className="my-4" />
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                <div>
                    <h4 className="font-semibold mb-2">Professional Summary</h4>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{selectedApplicant.data.summary || "No summary provided."}</p>
                </div>
                 {selectedApplicant.resumeFile && (
                    <div>
                        <h4 className="font-semibold mb-2">Resume</h4>
                         <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                            <FileText className="w-6 h-6 text-primary" />
                            <span className="text-sm font-medium text-foreground truncate">{selectedApplicant.resumeFile.name}</span>
                            <Button size="sm" variant="ghost" className="ml-auto">Download</Button>
                         </div>
                    </div>
                 )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
