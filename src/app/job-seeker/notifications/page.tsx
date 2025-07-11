import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Notifications</CardTitle>
          <CardDescription>
            Stay updated with your job applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Notifications Yet</h3>
                <p className="text-muted-foreground">You have no new notifications.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
