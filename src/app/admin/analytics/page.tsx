
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import BackButton from '@/components/ui/back-button';
import { Job } from '@/lib/sample-data';
import { Briefcase, Users } from 'lucide-react';

interface Application {
  jobId: number;
  applicantProfile: any;
}

interface AnalyticsData {
  totalJobs: number;
  totalApplications: number;
  applicantsPerJob: { name: string; applicants: number }[];
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const allJobs: Job[] = JSON.parse(localStorage.getItem('allJobs') || '[]');
      const applications: Application[] = JSON.parse(localStorage.getItem('applications') || '[]');

      const applicantsPerJobMap = new Map<number, number>();
      applications.forEach(app => {
        applicantsPerJobMap.set(app.jobId, (applicantsPerJobMap.get(app.jobId) || 0) + 1);
      });

      const applicantsPerJob = allJobs.map(job => ({
        name: job.title.length > 15 ? `${job.title.substring(0, 12)}...` : job.title,
        applicants: applicantsPerJobMap.get(job.id) || 0,
      }));

      setAnalyticsData({
        totalJobs: allJobs.length,
        totalApplications: applications.length,
        applicantsPerJob,
      });
    } catch (error) {
      console.error("Error processing analytics data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <BackButton />
       <div className="space-y-6">
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight">
                    Job Analytics
                </CardTitle>
                <CardDescription>
                    Gain insights into your job postings and applicant engagement.
                </CardDescription>
            </CardHeader>
        </Card>

        {loading ? (
          <p>Loading analytics...</p>
        ) : analyticsData ? (
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs Posted</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalJobs}</div>
                <p className="text-xs text-muted-foreground">jobs currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalApplications}</div>
                <p className="text-xs text-muted-foreground">applications received across all jobs</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Applicants per Job</CardTitle>
                <CardDescription>A breakdown of applications for each job posting.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.applicantsPerJob}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                        }}
                    />
                    <Bar dataKey="applicants" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
            <Card className="max-w-4xl mx-auto">
                <CardContent className="text-center">
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Could not load analytics data.</p>
                    </div>
                </CardContent>
            </Card>
        )}
       </div>
    </div>
  );
}
