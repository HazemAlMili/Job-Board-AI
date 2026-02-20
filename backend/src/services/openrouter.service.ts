import mammoth from 'mammoth';
import { openrouterClient, openrouterModel } from '../config/openrouter';
import { AIEvaluationResult, Job } from '../types';

// pdf-parse doesn't have proper TypeScript types, use require
let pdfParse = require('pdf-parse');
if (typeof pdfParse !== 'function' && (pdfParse as any).default) {
  pdfParse = (pdfParse as any).default;
}

export class OpenRouterService {
  /**
   * Evaluate resume against job requirements using OpenRouter
   */
  static async evaluateResume(
    resumeUrl: string,
    job: Job
  ): Promise<AIEvaluationResult> {
    if (!openrouterClient) {
      throw new Error('OpenRouter client not initialized. Please set OPENROUTER_API_KEY in your .env file.');
    }

    try {
      // Extract text content from resume URL
      const resumeContent = await this.extractResumeText(resumeUrl);

      const prompt = `You are an expert HR recruiter. Evaluate this candidate's resume against the job requirements.

**Job Details:**
- Title: ${job.title}
- Location: ${job.location}
- Description: ${job.description}
- Requirements: ${job.requirements}

**Resume Content:**
${resumeContent}

**Instructions:**
Analyze the resume and provide:
1. A score from 1-10 (where 10 is a perfect match)
2. Brief, honest feedback (2-3 sentences)

Respond ONLY with valid JSON in this exact format:
{
  "score": <number between 1-10>,
  "feedback": "<your 2-3 sentence feedback>"
}`;

      const response = await openrouterClient.chat.completions.create({
        model: openrouterModel,
        messages: [
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' }
      });

      const text = response.choices[0].message.content || '{}';
      const evaluation = JSON.parse(text) as AIEvaluationResult;

      // Validate score is between 1-10
      if (typeof evaluation.score !== 'number') {
        evaluation.score = 0;
      }
      evaluation.score = Math.max(0, Math.min(10, evaluation.score));

      return evaluation;
    } catch (error) {
      console.error('OpenRouter evaluation error:', error);
      throw new Error('Failed to evaluate resume with OpenRouter AI');
    }
  }

  /**
   * Download resume from Supabase Storage URL and extract text
   */
  private static async extractResumeText(fileUrl: string): Promise<string> {
    try {
      console.log(`[OpenRouterService] Downloading resume from: ${fileUrl}`);

      const response = await fetch(fileUrl);
      if (!response.ok) {
        return `[Error: Could not download resume file. Status: ${response.status}]`;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const ext = fileUrl.split('?')[0].split('.').pop()?.toLowerCase();
      console.log(`[OpenRouterService] File extension: ${ext}`);

      if (ext === 'txt') {
        return buffer.toString('utf-8');
      }

      if (ext === 'pdf') {
        console.log('[OpenRouterService] Parsing PDF...');
        try {
          const pdfData = await pdfParse(buffer);
          if (!pdfData.text || pdfData.text.trim().length === 0) {
            return '[Warning: The PDF appears to be empty or image-based. Please try a text-based PDF.]';
          }
          return pdfData.text;
        } catch (pdfError: any) {
          return `[Error parsing PDF: ${pdfError.message}]`;
        }
      }

      if (ext === 'docx' || ext === 'doc') {
        console.log('[OpenRouterService] Parsing DOCX...');
        const result = await mammoth.extractRawText({ buffer });
        return result.value || '[No text content found in DOCX]';
      }

      return `[Unsupported file format: ${ext}] Please upload a PDF, DOCX, or TXT file.`;
    } catch (error: any) {
      console.error('[OpenRouterService] Download/extraction error:', error);
      return `[Error reading resume file: ${error.message}]`;
    }
  }
}
