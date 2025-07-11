'use server';

import { generateSummaryFlow } from '@/ai/flows/generate-summary-flow';
import { z } from 'zod';

const FormSchema = z.object({
  profile: z.string(),
});

export type FormState = {
  summary: string;
  issues?: string[];
};

export async function generateSummary(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
      profile: formData.get('profile')
  });

  if (!validatedFields.success) {
    return {
      summary: '',
      issues: validatedFields.error.flatten().fieldErrors.profile,
    };
  }

  try {
    const profileData = JSON.parse(validatedFields.data.profile);
    const result = await generateSummaryFlow({
      headline: profileData.headline,
      skills: '', // Assuming skills are part of summary for now
      experience: profileData.summary,
    });
    
    return { summary: result.summary };

  } catch (error) {
    console.error('AI Error:', error);
    return { summary: '', issues: ['Failed to generate summary from AI.'] };
  }
}
