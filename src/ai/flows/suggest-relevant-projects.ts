
'use server';

/**
 * @fileOverview A job suggestion AI agent.
 *
 * - suggestRelevantJobs - A function that handles the job suggestion process.
 * - SuggestRelevantJobsInput - The input type for the suggestRelevantJobs function.
 * - SuggestRelevantJobsOutput - The return type for the suggestRelevantJobs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantJobsInputSchema = z.object({
  profile: z
    .string()
    .describe('The student profile, including skills, experience, and resume content.'),
});
export type SuggestRelevantJobsInput = z.infer<typeof SuggestRelevantJobsInputSchema>;

const SuggestRelevantJobsOutputSchema = z.object({
  jobSuggestions: z
    .array(z.string())
    .describe('A list of 3-5 job titles tailored to the profile.'),
});
export type SuggestRelevantJobsOutput = z.infer<typeof SuggestRelevantJobsOutputSchema>;

export async function suggestRelevantJobs(input: SuggestRelevantJobsInput): Promise<SuggestRelevantJobsOutput> {
  return suggestRelevantJobsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantJobsPrompt',
  input: {schema: SuggestRelevantJobsInputSchema},
  output: {schema: SuggestRelevantJobsOutputSchema},
  prompt: `You are a job suggestion expert. Based on the student's profile, you will provide a list of job suggestions.

  Profile: {{{profile}}}

  Provide a list of 3-5 job titles that are a good fit.`,
});

const suggestRelevantJobsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantJobsFlow',
    inputSchema: SuggestRelevantJobsInputSchema,
    outputSchema: SuggestRelevantJobsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
