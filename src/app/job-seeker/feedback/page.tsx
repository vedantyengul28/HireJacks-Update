
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import BackButton from '@/components/ui/back-button';

export default function FeedbackPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <BackButton />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Feedback</CardTitle>
          <CardDescription>
            We'd love to hear your thoughts on our platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Feedback Form Coming Soon</h3>
                <p className="text-muted-foreground">This page is under construction.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
