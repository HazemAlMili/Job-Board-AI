import { supabase } from '../config/supabase';
import type { Application } from '../types';

export class ApplicationModel {
  static async findById(id: number): Promise<Application | undefined> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Application;
  }

  static async updateStatus(id: number, status: Application['status']): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  }

  static async updateEvaluation(
    id: number,
    ai_score: number,
    ai_feedback: string,
    status: Application['status']
  ): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .update({
        ai_score,
        ai_feedback,
        status,
        evaluated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) throw error;
  }

  static async getAll(): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Application[];
  }
}
