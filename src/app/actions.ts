
'use server';

import { suggestRelevantProjects, type SuggestRelevantProjectsOutput } from '@/ai/flows/suggest-relevant-projects';
import { z } from 'zod';

const FormSchema = z.object({
  profile: z.string().min(20, { message: "Profile summary must be at least 20 characters." }),
});

export type FormState = {
  message: string;
  projects?: string[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function handleSuggestProjects(
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

  const { profile } = validatedFields.data;

  try {
    const result: SuggestRelevantProjectsOutput = await suggestRelevantProjects({
      profile
    });
    
    if (result.projectSuggestions && result.projectSuggestions.length > 0) {
        return { message: 'Success! Here are your tailored project suggestions.', projects: result.projectSuggestions };
    } else {
        return { message: 'No project suggestions found. Try refining your profile.' };
    }

  } catch (error) {
    console.error('AI Error:', error);
    return { message: 'We hit a snag. Could not get project suggestions from our AI assistant at the moment.' };
  }
}
