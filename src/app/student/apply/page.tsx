
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Check, Bookmark } from 'lucide-react';
import { sampleProjects, type Project } from '@/lib/sample-data';
import { useToast } from '@/hooks/use-toast';
import type { Notification } from '../notifications/page';
import BackButton from '@/components/ui/back-button';

function ProjectCard({ project, onSave, onApply, isApplied, isSaved }: { project: Project; onSave: (project: Project) => void; onApply: (projectId: number) => void; isApplied: boolean; isSaved: boolean; }) {
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
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.map(skill => <Badge variant="outline" key={skill}>{skill}</Badge>)}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">{project.salary}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onSave(project)}>
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
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

export default function ApplyProjectsPage() {
  const { toast } = useToast();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<number[]>([]);
  const [savedProjects, setSavedProjects] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('allProjects');
      const projects = storedProjects ? JSON.parse(storedProjects) : sampleProjects;
      setAllProjects(projects.slice().reverse());

      const storedAppliedProjects = localStorage.getItem('appliedProjects');
      if (storedAppliedProjects) {
        setAppliedProjects(JSON.parse(storedAppliedProjects));
      }

      const storedSavedProjects = localStorage.getItem('savedProjects');
      if (storedSavedProjects) {
        setSavedProjects(JSON.parse(storedSavedProjects).map((p: Project) => p.id));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setAllProjects(sampleProjects.slice().reverse());
    }
  }, []);

  const handleSaveProject = (projectToSave: Project) => {
    let currentSavedProjects: Project[] = [];
    try {
      currentSavedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    } catch (e) {
      console.error(e)
    }
    const isAlreadySaved = currentSavedProjects.some(project => project.id === projectToSave.id);
    
    let updatedSavedProjects;

    if (isAlreadySaved) {
      updatedSavedProjects = currentSavedProjects.filter(project => project.id !== projectToSave.id);
      toast({
        variant: "destructive",
        title: "Project Unsaved",
        description: `${projectToSave.title} at ${projectToSave.organization} has been removed from your list.`
      });
    } else {
      updatedSavedProjects = [...currentSavedProjects, projectToSave];
      toast({
        title: "Project Saved!",
        description: `${projectToSave.title} at ${projectToSave.organization} has been saved.`
      });
    }
    
    localStorage.setItem('savedProjects', JSON.stringify(updatedSavedProjects));
    setSavedProjects(updatedSavedProjects.map(p => p.id));
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
    
    const project = allProjects.find(p => p.id === projectId);
    if (project) {
      toast({
        title: "Application Sent!",
        description: `You successfully applied for the ${project.title} position at ${project.organization}.`
      });
       addNotification({
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
          <CardTitle className="text-2xl font-bold tracking-tight">Apply for Projects</CardTitle>
          <CardDescription>
            Browse and apply for all available projects. Found {allProjects.length} opening{allProjects.length !== 1 && 's'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {allProjects.length > 0 ? (
            allProjects.map(project => (
              <ProjectCard key={project.id} project={project} onSave={handleSaveProject} onApply={handleApply} isApplied={appliedProjects.includes(project.id)} isSaved={savedProjects.includes(project.id)} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Project Openings</h3>
              <p className="text-muted-foreground">There are currently no projects available. Please check back later.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
