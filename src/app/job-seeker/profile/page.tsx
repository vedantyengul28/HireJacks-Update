'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, User, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Saved!",
      description: "Your information has been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <User className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">Your Profile</CardTitle>
              <CardDescription>Keep your professional information up to date.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" placeholder="e.g., Senior Frontend Developer at TechCorp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea id="summary" placeholder="Tell us about your skills, experience, and career goals." rows={5} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="resume">Your Resume</Label>
                {!resumeFile ? (
                    <div className="flex items-center justify-center w-full">
                        <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (MAX. 5MB)</p>
                            </div>
                            <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                        </Label>
                    </div> 
                ) : (
                  <div className="flex items-center justify-between w-full p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium text-foreground truncate">{resumeFile.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setResumeFile(null)}>
                      <X className="w-4 h-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                )}
            </div>
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
