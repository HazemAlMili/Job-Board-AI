import api from './api';
import type { Job, CreateJobDTO, UpdateJobDTO } from '../types';


export const jobsService = {
  // Get all active jobs (public)
  getActiveJobs: async (): Promise<Job[]> => {
    const response = await api.get('/jobs');
    return response.data.jobs;
  },


  // Get all jobs (HR only)
  getAllJobs: async (): Promise<Job[]> => {
    const response = await api.get('/jobs/all/list');
    return response.data.jobs;
  },


  // Get single job
  getJob: async (id: number): Promise<Job> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data.job;
  },


  // Create job (HR only)
  createJob: async (jobData: CreateJobDTO): Promise<Job> => {
    const response = await api.post('/jobs', jobData);
    return response.data.job;
  },


  // Update job (HR only)
  updateJob: async (id: number, jobData: UpdateJobDTO): Promise<Job> => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data.job;
  },


  // Delete job (HR only)
  deleteJob: async (id: number): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },
};
