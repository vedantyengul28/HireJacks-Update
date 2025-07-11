'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useActionState } from 'react';
import { handleSuggestJobs, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, List, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 active:scale-95 transition-transform">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting Suggestions...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Suggest Jobs
        </>
      )}
    </Button>
  );
}

export default function JobSuggestionTool() {
  const initialState: FormState = { message: '', jobs: [] };
  const [state, formAction] = useActionState(handleSuggestJobs, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message.startsWith('Success')) {
      toast({
        title: "Suggestions Ready!",
        description: "We've found some jobs that might be a great fit for you.",
      })
    } else if (state.message.startsWith('We hit a snag') || state.message.startsWith('Please correct')) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong.",
        description: state.message,
      })
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile">Your Profile Summary</Label>
          <Textarea
            id="profile"
            name="profile"
            placeholder="e.g., Experienced frontend developer proficient in React, TypeScript, and Next.js. Passionate about building accessible user interfaces."
            rows={5}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="searchHistory">Recent Job Searches</Label>
          <Input
            id="searchHistory"
            name="searchHistory"
            placeholder="e.g., Senior React Developer, UI/UX Engineer, Remote Frontend Jobs"
            required
          />
        </div>
        <SubmitButton />
      </form>

      {state.issues && state.issues.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Input Error</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5">
                {state.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

      {state.jobs && state.jobs.length > 0 && (
        <div className="space-y-4 pt-4">
           <Alert variant="default" className="bg-primary/10 border-primary/20">
            <List className="h-4 w-4 !text-primary" />
            <AlertTitle className="text-primary">AI-Powered Job Suggestions</AlertTitle>
            <AlertDescription>
              Here are some roles we think you'll like based on your profile:
            </AlertDescription>
          </Alert>
          <ul className="space-y-3">
            {state.jobs.map((job, index) => (
              <li key={index} className="p-4 bg-card rounded-lg border shadow-sm flex items-center justify-between">
                <span className="font-medium text-card-foreground">{job}</span>
                <Button variant="ghost" size="sm">View</Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
