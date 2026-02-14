import api from './api';
import type { Application, ApplicationWithJobDetails, HRStats } from '../types';


export const hrService = {
  // Get all applications (HR only)
  getAllApplications: async (): Promise<ApplicationWithJobDetails[]> => {
    const response = await api.get('/hr/applications');
    return response.data.applications;
  },

  // Get application details (HR only)
  getApplicationDetails: async (id: number): Promise<ApplicationWithJobDetails> => {
    const response = await api.get(`/hr/applications/${id}`);
    return response.data.application;
  },

  // Update application status (HR only)
  updateApplicationStatus: async (id: number, status: Application['status']): Promise<Application> => {
    const response = await api.put(`/hr/applications/${id}/status`, { status });
    return response.data;
  },

  // Get HR dashboard statistics (HR only)
  getStats: async (): Promise<HRStats> => {
    const response = await api.get('/hr/stats');
    return response.data.stats;
  },
};
