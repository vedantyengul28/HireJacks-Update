
'use client';

import { handleSuggestProjects } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { sampleProjects, type Project } from '@/lib/sample-data';
import { ArrowUp, Briefcase, Loader2, MapPin, Bookmark, Check } from 'lucide-react';
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
        try {
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
        } catch (error) {
            console.error("Error accessing localStorage:", error);
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
                                <Link href="/student/profile" className="text-sm text-primary font-medium">
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
                        <p className="text-xs text-muted-foreground">Personal details help admins know more about you.</p>
                     </div>
                     <Link href="/student/profile">
                        <Button variant="outline" size="sm">Add Details</Button>
                     </Link>
                </div>
            </CardContent>
        </Card>
    );
}

function ProjectCard({ project, onSave, onApply, isApplied }: { project: Project; onSave: (project: Project) => void; onApply: (projectId: number) => void; isApplied: boolean; }) {

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription className="font-medium text-primary">{project.organization}</CardDescription>
            </div>
            <Badge variant={project.type === 'Full-time' ? 'default' : 'secondary'}>{project.type}</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground pt-2">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{project.location}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.map(skill => <Badge variant="outline" key={skill}>{skill}</Badge>)}
        </div>
        <div className="flex justify-between items-center">
             <p className="text-sm font-semibold">{project.salary}</p>
             <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onSave(project)}>
                    <Bookmark className="h-4 w-4" />
                    <span className="sr-only">Save Project</span>
                </Button>
                {isApplied ? (
                    <Button size="sm" disabled>
                        <Check className="mr-2 h-4 w-4" />
                        Applied
                    </Button>
                ) : (
                    <Button size="sm" onClick={() => onApply(project.id)}>Apply Now</Button>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AiProjectFeed() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(handleSuggestProjects, { message: '', projects: [] });
  const [submitted, setSubmitted] = useState(false);
  const [appliedProjects, setAppliedProjects] = useState<number[]>([]);
  const { toast } = useToast();
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const profileSummary = "Experienced frontend developer proficient in React, TypeScript, and Next.js. Passionate about building accessible user interfaces and working with modern web technologies. Skilled in state management with Redux and Zustand, and building design systems with Tailwind CSS.";

  useEffect(() => {
    try {
        const storedProjects = localStorage.getItem('allProjects');
        if (storedProjects) {
            setAllProjects(JSON.parse(storedProjects));
        } else {
            const initialProjects = sampleProjects;
            setAllProjects(initialProjects);
            localStorage.setItem('allProjects', JSON.stringify(initialProjects));
        }

        const storedAppliedProjects = localStorage.getItem('appliedProjects');
        if(storedAppliedProjects) {
            setAppliedProjects(JSON.parse(storedAppliedProjects));
        }
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        setAllProjects(sampleProjects);
    }
  }, []);

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

  const handleSaveProject = (projectToSave: Project) => {
    const savedProjects: Project[] = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    const isAlreadySaved = savedProjects.some(project => project.id === projectToSave.id);
    if (!isAlreadySaved) {
        localStorage.setItem('savedProjects', JSON.stringify([...savedProjects, projectToSave]));
        toast({
            title: "Project Saved!",
            description: `${projectToSave.title} at ${projectToSave.organization} has been saved.`
        });
    } else {
        toast({
            variant: "default",
            title: "Already Saved",
            description: `This project is already in your saved list.`
        });
    }
  };

  const handleApply = (projectId: number) => {
    const updatedAppliedProjects = [...appliedProjects, projectId];
    setAppliedProjects(updatedAppliedProjects);
    localStorage.setItem('appliedProjects', JSON.stringify(updatedAppliedProjects));

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Ensure we don't add duplicate applications
    const hasAlreadyApplied = applications.some((app: any) => app.projectId === projectId && app.applicantProfile.data.email === userProfile.data.email);

    if (!hasAlreadyApplied) {
      applications.push({ projectId, applicantProfile: userProfile });
      localStorage.setItem('applications', JSON.stringify(applications));
    }
    
    const project = allProjects.find(p => p.id === projectId);
    if (project) {
        toast({
            title: "Application Sent!",
            description: `You successfully applied for the ${project.title} position at ${project.organization}.`
        });
    }
  };
  
  const pending = isPending || (submitted && !state.projects?.length && !state.message.startsWith('No'));
  const projectsToDisplay = allProjects.slice().reverse();
  const suggestedProjects = projectsToDisplay.filter(project => state.projects?.some(suggestion => project.title.toLowerCase().includes(suggestion.toLowerCase().split(' ').slice(0, 2).join(' ') || '')));


  return (
    <div className="space-y-4">
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl font-bold tracking-tight">Projects based on your profile</h2>
        <Link href="/student/search">
          <Button variant="link">View all</Button>
        </Link>
      </div>

      {pending && (
        <div className="flex items-center justify-center p-8 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-muted-foreground">Finding projects for you...</p>
        </div>
      )}

      {!pending && suggestedProjects.length > 0 && (
        <div className="space-y-4">
          {suggestedProjects.map(project => (
            <ProjectCard key={project.id} project={project} onSave={handleSaveProject} onApply={handleApply} isApplied={appliedProjects.includes(project.id)} />
          ))}
        </div>
      )}

      {!pending && suggestedProjects.length === 0 && (
         <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">No recommended projects found at the moment.</p>
            <p className="text-sm text-muted-foreground">Try enhancing your profile for better matches.</p>
          </div>
      )}
    </div>
  );
}

export default function StudentPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <ProfileCompletionCard />
      <AiProjectFeed />
    </div>
  );
}
