'use server';

import {
  generateSummary as generateSummaryFlow,
  type GenerateSummaryInput,
  type GenerateSummaryOutput,
} from '@/ai/flows/generate-summary-flow';
import { z } from 'zod';

const FormSchema = z.object({
  profile: z.string(),
});

export async function generateSummary(
  prevState: { summary: string },
  formData: FormData
): Promise<{ summary: string }> {
  const validatedFields = FormSchema.safeParse({ profile: formData.get('profile') });

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    return { summary: '' };
  }
  
  try {
    const profileData = JSON.parse(validatedFields.data.profile);
    const input: GenerateSummaryInput = {
      headline: profileData.headline,
      experience: profileData.summary,
    };
    const result: GenerateSummaryOutput = await generateSummaryFlow(input);
    return { summary: result.summary };
  } catch (error) {
    console.error('Error generating summary:', error);
    return { summary: '' };
  }
}
