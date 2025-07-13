
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
import { sampleProjects, type Project } from '@/lib/sample-data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import BackButton from '@/components/ui/back-button';

export default function AdminPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [postedProjects, setPostedProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [projectDetails, setProjectDetails] = useState({
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
        const allProjectsString = localStorage.getItem('allProjects');
        if (allProjectsString) {
            const allProjects: Project[] = JSON.parse(allProjectsString);
            setPostedProjects(allProjects);
        } else {
            const initialProjects = sampleProjects;
            setPostedProjects(initialProjects);
            localStorage.setItem('allProjects', JSON.stringify(initialProjects));
        }
    } catch(e) {
        console.error(e);
        setPostedProjects(sampleProjects);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProjectDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: 'Full-time' | 'Part-time' | 'Contract') => {
    setProjectDetails(prev => ({ ...prev, type: value }));
  };

  const resetForm = () => {
    setProjectDetails({
        title: '',
        organization: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: '',
        skills: '',
    });
    setEditingProject(null);
    setShowForm(false);
  }

  const handlePostProject = (e: React.FormEvent) => {
    e.preventDefault();
    let allProjects: Project[] = [];
    try {
       const storedProjects = localStorage.getItem('allProjects');
       allProjects = storedProjects ? JSON.parse(storedProjects) : [];
    } catch (e) {
        console.error(e)
    }

    if (editingProject) {
        // Update existing project
        const updatedProject = {
            ...editingProject,
            ...projectDetails,
            skills: projectDetails.skills.split(',').map(s => s.trim()),
        };
        allProjects = allProjects.map(project => project.id === editingProject.id ? updatedProject : project);
        toast({ title: 'Project Updated!', description: 'Your project posting has been successfully updated.' });
    } else {
        // Create new project
        const newProject: Project = {
            id: allProjects.length > 0 ? Math.max(...allProjects.map(p => p.id)) + 1 : 1,
            ...projectDetails,
            skills: projectDetails.skills.split(',').map(s => s.trim()),
        };
        allProjects.push(newProject);
        toast({ title: 'Project Posted!', description: `${newProject.title} at ${newProject.organization} is now live.` });
    }

    localStorage.setItem('allProjects', JSON.stringify(allProjects));
    setPostedProjects(allProjects);
    resetForm();
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectDetails({
        ...project,
        skills: project.skills.join(', '),
    });
    setShowForm(true);
  };
  
  const handleDeleteProject = (projectId: number) => {
     let allProjects: Project[] = [];
      try {
        const storedProjects = localStorage.getItem('allProjects');
        allProjects = storedProjects ? JSON.parse(storedProjects) : [];
      } catch(e) {
        console.error(e)
      }
     allProjects = allProjects.filter(project => project.id !== projectId);
     localStorage.setItem('allProjects', JSON.stringify(allProjects));
     setPostedProjects(allProjects);
     toast({ variant: 'destructive', title: 'Project Deleted', description: 'The project posting has been removed.' });
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
            Manage your project postings and connect with top talent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <form onSubmit={handlePostProject} className="space-y-4">
               <h3 className="text-lg font-semibold">{editingProject ? 'Edit Project Posting' : 'Create New Project Posting'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" value={projectDetails.title} onChange={handleInputChange} placeholder="e.g., Senior Developer" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Name</Label>
                  <Input id="organization" value={projectDetails.organization} onChange={handleInputChange} placeholder="e.g., TechCorp" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={projectDetails.location} onChange={handleInputChange} placeholder="e.g., San Francisco, CA" required />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="type">Project Type</Label>
                    <Select value={projectDetails.type} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
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
                    <Input id="salary" value={projectDetails.salary} onChange={handleInputChange} placeholder="e.g., $120,000 - $160,000" required />
               </div>
               <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input id="skills" value={projectDetails.skills} onChange={handleInputChange} placeholder="e.g., React, TypeScript, Node.js" required />
               </div>
               <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea id="description" value={projectDetails.description} onChange={handleInputChange} placeholder="Describe the role and responsibilities..." rows={5} required />
               </div>
               <div className="flex gap-2 justify-end">
                    <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                    <Button type="submit">{editingProject ? 'Update Project' : 'Post Project'}</Button>
               </div>
            </form>
          ) : (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Your Project Postings ({postedProjects.length})</h3>
                    <Button onClick={() => setShowForm(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post a New Project
                    </Button>
                </div>
                {postedProjects.length > 0 ? (
                    <div className="space-y-4">
                        {postedProjects.slice().reverse().map(project => (
                            <Card key={project.id} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold">{project.title}</h4>
                                        <p className="text-sm text-muted-foreground">{project.organization} - {project.location}</p>
                                    </div>
                                    <Badge variant={project.type === 'Full-time' ? 'default' : 'secondary'}>{project.type}</Badge>
                                </div>
                                <Separator className="my-3"/>
                                <div className="flex justify-end gap-2">
                                     <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}><Edit className="mr-2 h-3 w-3"/> Edit</Button>
                                     <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}><Trash2 className="mr-2 h-3 w-3"/> Delete</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Projects Posted Yet</h3>
                        <p className="text-muted-foreground mb-4">Post a project to attract candidates.</p>
                    </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
