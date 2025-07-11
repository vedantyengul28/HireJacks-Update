'use server';

import { suggestRelevantJobs, type SuggestRelevantJobsOutput } from '@/ai/flows/suggest-relevant-jobs';
import { z } from 'zod';

const FormSchema = z.object({
  profile: z.string().min(20, { message: "Profile summary must be at least 20 characters." }),
  searchHistory: z.string().min(3, { message: "Search history must be at least 3 characters." }),
});

export type FormState = {
  message: string;
  jobs?: string[];
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
        ...(fieldErrors.searchHistory || []),
      ]
    };
  }

  const { profile, searchHistory } = validatedFields.data;

  try {
    const result: SuggestRelevantJobsOutput = await suggestRelevantJobs({
      profile,
      searchHistory,
    });
    
    if (result.jobSuggestions && result.jobSuggestions.length > 0) {
        return { message: 'Success! Here are your tailored job suggestions.', jobs: result.jobSuggestions };
    } else {
        return { message: 'No job suggestions found. Try refining your profile and search history.' };
    }

  } catch (error) {
    console.error('AI Error:', error);
    return { message: 'We hit a snag. Could not get job suggestions from our AI assistant at the moment.' };
  }
}
