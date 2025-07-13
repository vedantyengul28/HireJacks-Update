
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Briefcase, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import BackButton from '@/components/ui/back-button';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error("Error accessing localStorage for notifications:", error);
    }
  }, []);

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updatedNotifications);
    try {
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
        console.error("Error saving notifications to localStorage:", error);
    }
  };
  
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    try {
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
        console.error("Error saving notifications to localStorage:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <BackButton />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
             <Bell className="h-8 w-8 text-primary" />
             <div>
                <CardTitle className="text-2xl font-bold tracking-tight">Notifications</CardTitle>
                <CardDescription>
                  {unreadCount > 0 ? `You have ${unreadCount} unread notification(s).` : 'You are all caught up.'}
                </CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.slice().reverse().map(notification => (
                <div key={notification.id} className={`p-4 rounded-lg border flex items-start gap-4 ${notification.read ? 'bg-card' : 'bg-primary/10'}`}>
                  <div className="mt-1">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!notification.read && <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>Mark as read</Button>}
                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => deleteNotification(notification.id)}>
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete notification</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center">
              <Bell className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Notifications Yet</h3>
              <p className="text-muted-foreground">You have no new notifications.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
