import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function SavedJobsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Saved Jobs</CardTitle>
          <CardDescription>
            The jobs you save will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <Star className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Saved Jobs Yet</h3>
                <p className="text-muted-foreground">Start searching and save jobs you're interested in.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
