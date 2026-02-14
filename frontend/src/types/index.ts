// Type definitions matching backend models

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'applicant' | 'hr';
  created_at: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary_range: string;
  status: 'active' | 'closed';
  created_by: number;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  applicant_id: number | null;
  full_name: string;
  email: string;
  phone: string;
  resume_path: string;
  openai_file_id: string | null;
  ai_score: number | null;
  ai_feedback: string | null;
  status: 'pending' | 'evaluating' | 'rejected' | 'under_review' | 'accepted';
  created_at: string;
  evaluated_at: string | null;
}

export interface ApplicationWithJobDetails extends Application {
  job_title: string;
  job_location: string;
}

// Frontend-specific types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface APIResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  full_name: string;
}

export interface CreateJobDTO {
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary_range: string;
}

export interface UpdateJobDTO extends CreateJobDTO {
  status: 'active' | 'closed';
}

export interface CreateApplicationDTO {
  job_id: number;
  full_name: string;
  email: string;
  phone: string;
  resume: File;
}

export interface HRStats {
  total_applications: number;
  pending: number;
  evaluating: number;
  under_review: number;
  accepted: number;
  rejected: number;
  total_jobs: number;
  active_jobs: number;
  average_ai_score: number | null;
}
