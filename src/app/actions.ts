
'use server';

import { suggestRelevantJobs, type SuggestRelevantJobsOutput } from '@/ai/flows/suggest-relevant-jobs';
import { z } from 'zod';
import type { Job } from '@/lib/sample-data';

const FormSchema = z.object({
  profile: z.string().min(20, { message: "Profile summary must be at least 20 characters." }),
  allJobs: z.string(),
});

export type FormState = {
  message: string;
  jobs?: Job[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function handleSuggestJobs(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Please correct the errors below.',
      issues: [
        ...(fieldErrors.profile || []),
      ]
    };
  }

  const { profile, allJobs: allJobsString } = validatedFields.data;
  
  try {
    const allJobs: Job[] = JSON.parse(allJobsString);

    const result: SuggestRelevantJobsOutput = await suggestRelevantJobs({
      profile,
      allJobs
    });
    
    if (result.jobSuggestions && result.jobSuggestions.length > 0) {
        return { message: 'Success! Here are your tailored job suggestions.', jobs: result.jobSuggestions };
    } else {
        return { message: 'No job suggestions found. Try refining your profile.', jobs: [] };
    }

  } catch (error) {
    console.error('AI Error:', error);
    return { message: 'We hit a snag. Could not get job suggestions from our AI assistant at the moment.' };
  }
}

    