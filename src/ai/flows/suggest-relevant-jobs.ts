
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
import type { Job } from '@/lib/sample-data';

const JobSchema = z.object({
    id: z.number(),
    title: z.string(),
    organization: z.string(),
    location: z.string(),
    type: z.enum(['Full-time', 'Part-time', 'Contract']),
    description: z.string(),
    skills: z.array(z.string()),
    salary: z.string(),
});

const SuggestRelevantJobsInputSchema = z.object({
  profile: z
    .string()
    .describe('The student profile, including skills, experience, and resume content.'),
  allJobs: z.array(JobSchema).describe('The list of all available jobs to filter from.'),
});
export type SuggestRelevantJobsInput = z.infer<typeof SuggestRelevantJobsInputSchema>;

const SuggestRelevantJobsOutputSchema = z.object({
  jobSuggestions: z
    .array(JobSchema)
    .describe('A list of 3-5 job objects from the provided list that are most relevant to the student profile.'),
});
export type SuggestRelevantJobsOutput = z.infer<typeof SuggestRelevantJobsOutputSchema>;

export async function suggestRelevantJobs(input: SuggestRelevantJobsInput): Promise<SuggestRelevantJobsOutput> {
  return suggestRelevantJobsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantJobsPrompt',
  input: {schema: SuggestRelevantJobsInputSchema},
  output: {schema: SuggestRelevantJobsOutputSchema},
  prompt: `You are an expert career counselor. Your task is to analyze the provided student profile and the list of available jobs.

Based on the student's skills, experience, and interests outlined in their profile, select 3 to 5 jobs from the list that are the best fit.

Return these jobs as an array of job objects in the 'jobSuggestions' field.

Student Profile:
{{{profile}}}

List of all available jobs:
{{{json allJobs}}}
`,
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

    