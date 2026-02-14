import fs from 'fs';
import mammoth from 'mammoth';
import { geminiClient, geminiModel } from '../config/gemini';
import { AIEvaluationResult, Job } from '../types';

// pdf-parse doesn't have proper TypeScript types, use require
let pdfParse = require('pdf-parse');
// Handle CJS/ESM interop: if it receives an object with default, use that
if (typeof pdfParse !== 'function' && (pdfParse as any).default) {
  pdfParse = (pdfParse as any).default;
}

export class GeminiService {
  /**
   * Evaluate resume against job requirements using Google Gemini
   */
  static async evaluateResume(
    resumePath: string,
    job: Job
  ): Promise<AIEvaluationResult> {
    if (!geminiClient) {
      throw new Error('Gemini client not initialized. Please set GEMINI_API_KEY in your .env file.');
    }

    try {
      // Read the resume file content
      const resumeContent = await this.extractResumeText(resumePath);

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

Consider:
- Relevant skills and experience
- Education background
- Years of experience
- Cultural fit indicators

Respond ONLY with valid JSON in this exact format:
{
  "score": <number between 1-10>,
  "feedback": "<your 2-3 sentence feedback>"
}`;

      const model = geminiClient.getGenerativeModel({ model: geminiModel });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response (Gemini might wrap it in markdown code blocks)
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      const evaluation = JSON.parse(jsonText) as AIEvaluationResult;

      // Validate score is between 1-10
      if (evaluation.score < 1 || evaluation.score > 10) {
        evaluation.score = Math.max(1, Math.min(10, evaluation.score));
      }

      return evaluation;
    } catch (error) {
      console.error('Gemini evaluation error:', error);
      throw new Error('Failed to evaluate resume with Gemini AI');
    }
  }

  /**
   * Extract text content from resume file
   * Supports: TXT, PDF, DOCX
   */
  private static async extractResumeText(filePath: string): Promise<string> {
    try {
      console.log(`[GeminiService] Extracting text from: ${filePath}`);
      
      // Ensure we have an absolute path or correct relative path
      // If filePath starts with 'uploads', make sure it matches CWD
      if (!fs.existsSync(filePath)) {
        console.error(`[GeminiService] File not found at path: ${filePath}`);
        // Try resolving relative to CWD if it fails
        const absolutePath = require('path').resolve(filePath);
        console.log(`[GeminiService] Trying absolute path: ${absolutePath}`);
        if (!fs.existsSync(absolutePath)) {
             return `[Error: File not found at ${filePath}]`;
        }
        filePath = absolutePath;
      }

      // Check file extension
      const ext = filePath.toLowerCase().split('.').pop();
      console.log(`[GeminiService] File extension: ${ext}`);
      
      if (ext === 'txt') {
        return fs.readFileSync(filePath, 'utf-8');
      }
      
      if (ext === 'pdf') {
        console.log('[GeminiService] Parsing PDF...');
        const dataBuffer = fs.readFileSync(filePath);
        try {
            const pdfData = await pdfParse(dataBuffer);
            console.log(`[GeminiService] PDF Parsed. Text length: ${pdfData.text?.length}`);
            if (!pdfData.text || pdfData.text.trim().length === 0) {
                console.warn('[GeminiService] PDF text is empty!');
                return '[Warning: The PDF containing the resume appears to be empty or image-based user could maybe try converting to text]';
            }
            return pdfData.text;
        } catch (pdfError: any) {
            console.error('[GeminiService] pdf-parse error:', pdfError);
            return `[Error parsing PDF: ${pdfError.message}]`;
        }
      }
      
      if (ext === 'docx' || ext === 'doc') {
        console.log('[GeminiService] Parsing DOCX...');
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value || '[No text content found in DOCX]';
      }
      
      return `[Unsupported file format: ${ext}]\nPlease upload a PDF, DOCX, or TXT file.`;
      
    } catch (error: any) {
      console.error('[GeminiService] General extraction error:', error);
      return `[Error reading resume file: ${error.message}]`;
    }
  }
}

