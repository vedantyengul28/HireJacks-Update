
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, User, FileText, X, Camera, Edit, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  summary: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(true);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    headline: '',
    summary: '',
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      if (profilePhotoPreview) {
          URL.revokeObjectURL(profilePhotoPreview);
      }
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };
  
  useEffect(() => {
    // Clean up the object URL to avoid memory leaks
    return () => {
      if (profilePhotoPreview) {
        URL.revokeObjectURL(profilePhotoPreview);
      }
    };
  }, [profilePhotoPreview]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast({
      title: "Profile Saved!",
      description: "Your information has been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <User className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">Your Profile</CardTitle>
                <CardDescription>Keep your professional information up to date.</CardDescription>
              </div>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex justify-center">
                <div className={cn("relative group", !isEditing && "pointer-events-none")}>
                    <Avatar className="h-32 w-32" >
                        <AvatarImage src={profilePhotoPreview || undefined} alt="Profile Photo" />
                        <AvatarFallback>
                            <span className="text-4xl">
                                <User />
                            </span>
                        </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <div 
                            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => photoInputRef.current?.click()}
                        >
                            <Camera className="h-8 w-8 text-white" />
                        </div>
                    )}
                </div>
                {isEditing && (
                    <Input 
                        type="file" 
                        ref={photoInputRef} 
                        className="hidden" 
                        accept="image/png, image/jpeg"
                        onChange={handlePhotoFileChange} 
                    />
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input id="firstName" placeholder="John" value={profileData.firstName} onChange={handleInputChange} />
                ) : (
                  <p className="font-medium pt-2">{profileData.firstName || 'Not set'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input id="lastName" placeholder="Doe" value={profileData.lastName} onChange={handleInputChange} />
                ) : (
                   <p className="font-medium pt-2">{profileData.lastName || 'Not set'}</p>
                )}
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input id="email" type="email" placeholder="john.doe@example.com" value={profileData.email} onChange={handleInputChange}/>
              ) : (
                 <p className="font-medium pt-2">{profileData.email || 'Not set'}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              {isEditing ? (
                <Input id="headline" placeholder="e.g., Senior Frontend Developer at TechCorp" value={profileData.headline} onChange={handleInputChange} />
              ) : (
                <p className="font-medium pt-2">{profileData.headline || 'Not set'}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              {isEditing ? (
                <Textarea id="summary" placeholder="Tell us about your skills, experience, and career goals." rows={5} value={profileData.summary} onChange={handleInputChange} />
              ) : (
                 <p className="font-medium pt-2 whitespace-pre-wrap">{profileData.summary || 'Not set'}</p>
              )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="resume">Your Resume</Label>
                {!isEditing && !resumeFile && <p className="font-medium pt-2">No resume uploaded.</p>}
                
                {isEditing && !resumeFile && (
                    <div className="flex items-center justify-center w-full">
                        <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (MAX. 5MB)</p>
                            </div>
                            <Input id="dropzone-file" type="file" className="hidden" onChange={handleResumeFileChange} />
                        </Label>
                    </div> 
                )}

                {resumeFile && (
                  <div className="flex items-center justify-between w-full p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium text-foreground truncate">{resumeFile.name}</span>
                    </div>
                    {isEditing ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setResumeFile(null)}>
                        <X className="w-4 h-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    ) : (
                       <Button variant="outline" size="sm" asChild>
                           <a href={URL.createObjectURL(resumeFile)} download={resumeFile.name}>Download</a>
                       </Button>
                    )}
                  </div>
                )}
            </div>
            {isEditing && (
              <Button type="submit" className="w-full">
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
