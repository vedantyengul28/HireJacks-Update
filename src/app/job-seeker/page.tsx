import JobSuggestionTool from '@/components/job-suggestion-tool';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function JobSeekerPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Find Your Next Opportunity
          </CardTitle>
          <CardDescription>
            Let our AI assistant suggest jobs tailored to your profile and search preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobSuggestionTool />
        </CardContent>
      </Card>
    </div>
  );
}
