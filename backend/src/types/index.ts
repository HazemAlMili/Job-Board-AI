import { Request } from 'express';

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary_range: string;
  status: 'active' | 'closed';
  created_by: string; // Supabase user ID is UUID
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  applicant_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  resume_path: string;
  ai_score: number | null;
  ai_feedback: string | null;
  status: 'pending' | 'evaluating' | 'rejected' | 'under_review' | 'accepted';
  created_at: string;
  evaluated_at: string | null;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'applicant' | 'hr';
  };
}

export interface AIEvaluationResult {
  score: number;
  feedback: string;
}
