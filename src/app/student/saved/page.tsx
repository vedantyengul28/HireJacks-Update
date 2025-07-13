
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Trash2, Check } from 'lucide-react';
import { type Project } from '@/lib/sample-data';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';

function SavedProjectCard({ project, onRemove, onApply, isApplied }: { project: Project, onRemove: (projectId: number) => void, onApply: (projectId: number) => void, isApplied: boolean }) {

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
             <div className='flex items-center gap-2'>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onRemove(project.id)}>
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Remove Project</span>
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


export default function SavedProjectsPage() {
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
        const projectsFromStorage = localStorage.getItem('savedProjects');
        if (projectsFromStorage) {
          setSavedProjects(JSON.parse(projectsFromStorage));
        }
        const appliedFromStorage = localStorage.getItem('appliedProjects');
        if (appliedFromStorage) {
          setAppliedProjects(JSON.parse(appliedFromStorage));
        }
    } catch(e) {
        console.error(e)
    }
  }, []);

  const handleRemoveProject = (projectId: number) => {
    const updatedProjects = savedProjects.filter(project => project.id !== projectId);
    setSavedProjects(updatedProjects);
    localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
    toast({
        variant: "destructive",
        title: "Project Removed",
        description: "The project has been removed from your saved list."
    });
  }

  const handleApply = (projectId: number) => {
    const updatedAppliedProjects = [...appliedProjects, projectId];
    setAppliedProjects(updatedAppliedProjects);
    localStorage.setItem('appliedProjects', JSON.stringify(updatedAppliedProjects));

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    const hasAlreadyApplied = applications.some((app: any) => app.projectId === projectId && app.applicantProfile.data.email === userProfile.data.email);

    if (!hasAlreadyApplied) {
      applications.push({ projectId, applicantProfile: userProfile });
      localStorage.setItem('applications', JSON.stringify(applications));
    }

    const project = savedProjects.find(p => p.id === projectId);
     if (project) {
        toast({
            title: "Application Sent!",
            description: `You successfully applied for the ${project.title} position at ${project.organization}.`
        });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <BackButton />
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className='flex items-center gap-4'>
            <Star className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="text-2xl font-bold tracking-tight">Saved Projects</CardTitle>
                <CardDescription>
                    The projects you save will appear here. Found {savedProjects.length} project{savedProjects.length !== 1 && 's'}.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {savedProjects.length > 0 ? (
                <div className="space-y-4">
                    {savedProjects.map(project => (
                        <SavedProjectCard key={project.id} project={project} onRemove={handleRemoveProject} onApply={handleApply} isApplied={appliedProjects.includes(project.id)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Star className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                    <h3 className="text-xl font-semibold mb-2">No Saved Projects Yet</h3>
                    <p className="text-muted-foreground">Start searching and save projects you're interested in.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
