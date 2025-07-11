import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function RecruiterPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Recruiter Dashboard
          </CardTitle>
          <CardDescription>
            Manage your job postings and connect with top talent.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Create a New Job Posting</h3>
                <p className="text-muted-foreground mb-4">You have no active job postings. Get started now!</p>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post a Job
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
