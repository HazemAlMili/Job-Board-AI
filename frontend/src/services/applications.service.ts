import { supabase } from '../lib/supabaseClient';
import type { Application, CreateApplicationDTO } from '../types';

export const applicationsService = {
  // Submit application with resume
  submitApplication: async (applicationData: CreateApplicationDTO): Promise<Application> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Upload Resume
    const fileExt = applicationData.resume.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, applicationData.resume);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    // 2. Insert Application Record
    const { data, error } = await supabase
      .from('applications')
      .insert({
        job_id: applicationData.job_id,
        applicant_id: user?.id || null, // Allow unauthenticated application if supported, else user?.id
        full_name: applicationData.full_name,
        email: applicationData.email,
        phone: applicationData.phone,
        resume_path: publicUrlData.publicUrl,
        status: 'pending' // Default status
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get applicant's own applications
  getMyApplications: async (): Promise<Application[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('applications')
      .select('*, job:jobs(title, location)') // Join with jobs
      .eq('applicant_id', user.id);

    if (error) throw error;
    return data || [];
  },

  // Get single application
  getApplication: async (id: number): Promise<Application> => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
};
