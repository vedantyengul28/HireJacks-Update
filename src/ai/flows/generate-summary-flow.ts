'use server';

/**
 * @fileOverview An AI agent for generating professional summaries.
 *
 * - generateSummaryFlow - A function that generates a professional summary.
 * - GenerateSummaryInput - The input type for the generateSummaryFlow function.
 * - GenerateSummaryOutput - The return type for the generateSummaryFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSummaryInputSchema = z.object({
  headline: z.string().describe("The user's professional headline."),
  experience: z.string().describe("The user's summary of their experience, skills, and goals."),
});
export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

const GenerateSummaryOutputSchema = z.object({
  summary: z.string().describe('A professionally written, concise summary (3-4 sentences) based on the provided details.'),
});
export type GenerateSummaryOutput = z.infer<typeof GenerateSummaryOutputSchema>;

export async function generateSummary(input: GenerateSummaryInput): Promise<GenerateSummaryOutput> {
  return generateSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSummaryPrompt',
  input: {schema: GenerateSummaryInputSchema},
  output: {schema: GenerateSummaryOutputSchema},
  prompt: `You are an expert resume writer and career coach. Based on the user's headline and experience summary, write a compelling and professional summary for their job profile. 
  
  The summary should be concise (around 3-4 sentences), written in the first person, and highlight their key strengths and career ambitions.

  User's Headline: {{{headline}}}
  User's Experience: {{{experience}}}

  Generate a professional summary.`,
});

export const generateSummaryFlow = ai.defineFlow(
  {
    name: 'generateSummaryFlow',
    inputSchema: GenerateSummaryInputSchema,
    outputSchema: GenerateSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
