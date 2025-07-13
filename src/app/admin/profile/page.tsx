
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Edit, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileData {
  name: string;
  email: string;
  organization: string;
}

export default function AdminProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    organization: '',
  });

  useEffect(() => {
    try {
        const storedProfile = localStorage.getItem('adminProfile');
        if (storedProfile) {
          const { data } = JSON.parse(storedProfile);
          if (data) {
            setProfileData(data);
          }
        } else {
          setIsEditing(true);
        }
    } catch(e) {
        console.error(e)
        setIsEditing(true);
    } finally {
        setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const profileToStore = {
          data: profileData,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('adminProfile', JSON.stringify(profileToStore));
        
        // Also update the adminUsers list to keep signup/login consistent
        const admins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
        const currentAdminIndex = admins.findIndex((r: any) => r.email === profileData.email);
        if(currentAdminIndex > -1) {
            admins[currentAdminIndex].name = profileData.name;
            admins[currentAdminIndex].organization = profileData.organization;
            localStorage.setItem('adminUsers', JSON.stringify(admins));
        }

        setIsEditing(false);
        toast({
          title: "Profile Saved!",
          description: "Your information has been updated successfully.",
        });
    } catch(e) {
        console.error(e)
        toast({
            variant: "destructive",
            title: "Error saving profile",
            description: "Could not save your profile. Please try again."
        })
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <BackButton />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <User className="h-8 w-8 text-accent" />
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">Recruiter Profile</CardTitle>
                <CardDescription>Manage your personal and company information.</CardDescription>
              </div>
            </div>
            {!isEditing && !loading && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-6">
                <div className="flex justify-center">
                    <Skeleton className="h-32 w-32 rounded-full" />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex justify-center">
                  <Avatar className="h-32 w-32" >
                      <AvatarFallback>
                          <span className="text-4xl">
                              <User />
                          </span>
                      </AvatarFallback>
                  </Avatar>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input id="name" placeholder="John Doe" value={profileData.name} onChange={handleInputChange} />
                ) : (
                  <p className="font-medium pt-2">{profileData.name || 'Not set'}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization">Organization Name</Label>
                {isEditing ? (
                  <Input id="organization" placeholder="TechCorp" value={profileData.organization} onChange={handleInputChange} />
                ) : (
                  <p className="font-medium pt-2">{profileData.organization || 'Not set'}</p>
                )}
              </div>

               <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <p className="font-medium pt-2 text-muted-foreground">{profileData.email || 'Not set'}</p>
                {isEditing && <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>}
              </div>

              {isEditing && (
                <Button type="submit" className="w-full">
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
