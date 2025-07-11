import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export default function ApplyJobsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Apply for Jobs</CardTitle>
          <CardDescription>
            Browse and apply for jobs that match your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground">Jobs you apply for will appear here.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
