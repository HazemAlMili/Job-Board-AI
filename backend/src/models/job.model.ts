import { supabase } from '../config/supabase';
import type { Job } from '../types';

export class JobModel {
  static async findById(id: number): Promise<Job | undefined> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Job;
  }

  static async getAll(): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Job[];
  }
}
