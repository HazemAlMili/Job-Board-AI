import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';

// Applicant pages
import JobsListing from './pages/applicant/JobsListing';
import JobDetails from './pages/applicant/JobDetails';
import ApplyJob from './pages/applicant/ApplyJob';
import MyApplications from './pages/applicant/MyApplications';

// HR pages
import Dashboard from './pages/hr/Dashboard';
import ManageJobs from './pages/hr/ManageJobs';
import CreateEditJob from './pages/hr/CreateEditJob';
import AllApplications from './pages/hr/AllApplications';
import ApplicationDetails from './pages/hr/ApplicationDetails';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobsListing />} />
              <Route path="/jobs/:id" element={<JobDetails />} />

              {/* Applicant protected routes */}
              <Route
                path="/apply/:id"
                element={
                  <ProtectedRoute>
                    <ApplyJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* HR protected routes */}
              <Route
                path="/hr/dashboard"
                element={
                  <ProtectedRoute requireHR>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/jobs"
                element={
                  <ProtectedRoute requireHR>
                    <ManageJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/jobs/create"
                element={
                  <ProtectedRoute requireHR>
                    <CreateEditJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/jobs/edit/:id"
                element={
                  <ProtectedRoute requireHR>
                    <CreateEditJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/applications"
                element={
                  <ProtectedRoute requireHR>
                    <AllApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/applications/:id"
                element={
                  <ProtectedRoute requireHR>
                    <ApplicationDetails />
                  </ProtectedRoute>
                }
              />

              {/* Welcome & Default routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
