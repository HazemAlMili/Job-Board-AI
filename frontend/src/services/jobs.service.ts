import { supabase } from '../lib/supabaseClient';
import type { Job, CreateJobDTO, UpdateJobDTO } from '../types';

export const jobsService = {
  // Get all active jobs (public)
  getActiveJobs: async (): Promise<Job[]> => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active');
      
    if (error) throw error;
    return data || [];
  },

  // Get all jobs (HR only)
  getAllJobs: async (): Promise<Job[]> => {
    // In a real app we might paginate 'list'
    const { data, error } = await supabase
      .from('jobs')
      .select('*');
      
    if (error) throw error;
    return data || [];
  },

  // Get single job
  getJob: async (id: number): Promise<Job> => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create job (HR only)
  createJob: async (jobData: CreateJobDTO): Promise<Job> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        ...jobData,
        created_by: user.id,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update job (HR only)
  updateJob: async (id: number, jobData: UpdateJobDTO): Promise<Job> => {
    const { data, error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete job (HR only)
  deleteJob: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
