
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, MapPin, Search as SearchIcon, Code, Bookmark, Check } from 'lucide-react';
import { sampleProjects, type Project } from '@/lib/sample-data';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';

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
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
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


export default function ProjectSearchPage() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    skills: '',
  });
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<number[]>([]);

  useEffect(() => {
    try {
        const storedProjects = localStorage.getItem('allProjects');
        const projects = storedProjects ? JSON.parse(storedProjects) : sampleProjects;
        setAllProjects(projects);
        setFilteredProjects(projects.slice().reverse()); // Show newest first
        
        const storedAppliedProjects = localStorage.getItem('appliedProjects');
        if (storedAppliedProjects) {
          setAppliedProjects(JSON.parse(storedAppliedProjects));
        }
    } catch(error) {
        console.error("Error accessing localStorage:", error);
        setAllProjects(sampleProjects);
        setFilteredProjects(sampleProjects.slice().reverse());
    }
  }, []);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const lowercasedKeyword = filters.keyword.toLowerCase();
    const lowercasedLocation = filters.location.toLowerCase();
    const lowercasedSkills = filters.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s);

    const results = allProjects.filter((project: Project) => {
      const titleMatch = project.title.toLowerCase().includes(lowercasedKeyword);
      const organizationMatch = project.organization.toLowerCase().includes(lowercasedKeyword);
      const descriptionMatch = project.description.toLowerCase().includes(lowercasedKeyword);
      const keywordMatch = titleMatch || organizationMatch || descriptionMatch;

      const locationMatch = project.location.toLowerCase().includes(lowercasedLocation);

      const skillsMatch = lowercasedSkills.length === 0 || lowercasedSkills.every(skill => 
        project.skills.some(projectSkill => projectSkill.toLowerCase().includes(skill))
      );

      return keywordMatch && locationMatch && skillsMatch;
    });

    setFilteredProjects(results.slice().reverse());
  };
  
  const handleSaveProject = (projectToSave: Project) => {
    let savedProjects: Project[] = [];
    try {
      savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    } catch (e) {
      console.error(e)
    }

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


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <BackButton />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Find Your Dream Project</CardTitle>
          <CardDescription>Search for projects based on your skills and preferences.</CardDescription>
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
              Search Projects
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
         <h2 className="text-2xl font-bold tracking-tight">
            {filteredProjects.length} Project Openings
        </h2>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} onSave={handleSaveProject} onApply={handleApply} isApplied={appliedProjects.includes(project.id)} />
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
