import api from './api';
import type { Application, CreateApplicationDTO } from '../types';


export const applicationsService = {
  // Submit application with resume
  submitApplication: async (applicationData: CreateApplicationDTO): Promise<Application> => {
    const formData = new FormData();
    formData.append('job_id', applicationData.job_id.toString());
    formData.append('full_name', applicationData.full_name);
    formData.append('email', applicationData.email);
    formData.append('phone', applicationData.phone);
    formData.append('resume', applicationData.resume);

    const response = await api.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.application;
  },

  // Get applicant's own applications
  getMyApplications: async (): Promise<Application[]> => {
    const response = await api.get('/applications/my-applications');
    return response.data.applications;
  },

  // Get single application
  getApplication: async (id: number): Promise<Application> => {
    const response = await api.get(`/applications/${id}`);
    return response.data.application;
  },
};
