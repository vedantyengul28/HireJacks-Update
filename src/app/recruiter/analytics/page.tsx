
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import BackButton from '@/components/ui/back-button';

export default function RecruiterAnalyticsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <BackButton />
       <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Job Analytics
          </CardTitle>
          <CardDescription>
            Gain insights into your job postings and applicant engagement.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard Coming Soon</h3>
                <p className="text-muted-foreground">This feature is under construction.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
