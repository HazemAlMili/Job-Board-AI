import { supabase } from '../lib/supabaseClient';
import type { Application, ApplicationWithJobDetails, HRStats } from '../types';

export const hrService = {
  // Get all applications (HR only)
  getAllApplications: async (): Promise<ApplicationWithJobDetails[]> => {
    // We join the 'jobs' table to get job title and location
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs (
          title,
          location
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match ApplicationWithJobDetails logic if needed
    // Supabase returns nested object for joins. We might need to flatten it.
    return (data || []).map((app: any) => ({
      ...app,
      job_title: app.job?.title,
      job_location: app.job?.location
    }));
  },

  // Get application details (HR only)
  getApplicationDetails: async (id: number): Promise<ApplicationWithJobDetails> => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs (
          title,
          location
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      job_title: data.job?.title,
      job_location: data.job?.location
    };
  },

  // Update application status (HR only)
  updateApplicationStatus: async (id: number, status: Application['status']): Promise<Application> => {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get HR dashboard statistics (HR only)
  getStats: async (): Promise<HRStats> => {
    // This requires multiple queries or a stored procedure/view in Supabase.
    // Simulating with multiple queries for now.

    const { count: totalApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    const { count: pending } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
      
    const { count: evaluating } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'evaluating');

    const { count: underReview } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'under_review');
        
    const { count: accepted } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'accepted');

    const { count: rejected } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    const { count: totalJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });

    const { count: activeJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Calculating average AI score might be expensive without backend logic
    // We'll leave it as null or implement a basic fetch
    const { data: scoreData } = await supabase
      .from('applications')
      .select('ai_score');
      
    let averageAiScore = 0;
    if (scoreData && scoreData.length > 0) {
       const scores = scoreData.map(a => a.ai_score || 0).filter(s => s > 0);
       averageAiScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    }

    return {
      total_applications: totalApplications || 0,
      pending: pending || 0,
      evaluating: evaluating || 0,
      under_review: underReview || 0,
      accepted: accepted || 0,
      rejected: rejected || 0,
      total_jobs: totalJobs || 0,
      active_jobs: activeJobs || 0,
      average_ai_score: averageAiScore,
    };
  },
};
