import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Briefcase, 
  FileText,
  Plus,
  Eye,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { hrService } from '../../services/hr.service';
import type { HRStats, ApplicationWithJobDetails } from '../../types';
import LoadingAI from '../../components/LoadingAI';
import StatusBadge from '../../components/StatusBadge';
import GlassCard from '../../components/ui/GlassCard';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<HRStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<ApplicationWithJobDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, applicationsData] = await Promise.all([
        hrService.getStats(),
        hrService.getAllApplications()
      ]);
      setStats(statsData);
      setRecentApplications(applicationsData.slice(0, 5)); // Show only 5 most recent
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAI fullPage message="Loading dashboard..." />;

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-violet via-primary-cyan to-primary-violet bg-clip-text text-transparent mb-2">
          HR Dashboard
        </h1>
        <p className="text-text-secondary text-lg">Manage jobs and applications with AI-powered insights</p>
      </motion.div>

      {error && (
        <motion.div 
          className="alert alert-error mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* Bento Grid Stats */}
      {stats && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Large Card - Total Applications */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2">
            <GlassCard className="p-6 h-full flex flex-col justify-between" glow glowColor="violet">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary-violet to-primary-cyan">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-text-secondary font-medium">Total Applications</h3>
                </div>
                <p className="text-6xl font-bold text-text-primary mb-2">{stats.total_applications}</p>
                <div className="flex items-center gap-2 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">All time</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Pending Review */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <GlassCard className="p-6" glow glowColor="cyan">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-primary-cyan" />
                    <h3 className="text-text-secondary text-sm font-medium">Pending Review</h3>
                  </div>
                  <p className="text-4xl font-bold text-text-primary">
                    {stats.pending + stats.evaluating + stats.under_review}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary-cyan/10">
                  <Clock className="w-8 h-8 text-primary-cyan" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Active Jobs */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <GlassCard className="p-6" glow glowColor="violet">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-primary-violet" />
                    <h3 className="text-text-secondary text-sm font-medium">Active Jobs</h3>
                  </div>
                  <p className="text-4xl font-bold text-text-primary">{stats.active_jobs}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary-violet/10">
                  <Briefcase className="w-8 h-8 text-primary-violet" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Accepted */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <GlassCard className="p-6" glow glowColor="success">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h3 className="text-text-secondary text-sm font-medium">Accepted</h3>
                  </div>
                  <p className="text-4xl font-bold text-text-primary">{stats.accepted}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-400/10">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Rejected */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <GlassCard className="p-6" glow glowColor="danger">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <h3 className="text-text-secondary text-sm font-medium">Rejected</h3>
                  </div>
                  <p className="text-4xl font-bold text-text-primary">{stats.rejected}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-400/10">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Total Jobs */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <GlassCard className="p-6" glow glowColor="cyan">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary-cyan" />
                    <h3 className="text-text-secondary text-sm font-medium">Total Jobs</h3>
                  </div>
                  <p className="text-4xl font-bold text-text-primary">{stats.total_jobs}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary-cyan/10">
                  <FileText className="w-8 h-8 text-primary-cyan" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div 
        className="flex flex-wrap gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={() => navigate('/hr/jobs/create')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-white font-semibold shadow-glow hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all duration-300"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Create New Job
        </motion.button>
        <motion.button
          onClick={() => navigate('/hr/applications')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-text-primary font-semibold hover:bg-surface-hover hover:border-border-hover transition-all duration-300"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="w-5 h-5" />
          View All Applications
        </motion.button>
      </motion.div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-text-primary mb-4">Recent Applications</h2>
        {recentApplications.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary text-lg">No recent applications</p>
          </GlassCard>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {recentApplications.map((app) => (
              <motion.div key={app.id} variants={itemVariants}>
                <GlassCard 
                  className="p-6 cursor-pointer"
                  onClick={() => navigate(`/hr/applications/${app.id}`)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Applicant Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-text-primary mb-1 transition-colors truncate">
                        {app.full_name}
                      </h3>
                      <p className="text-text-secondary text-sm truncate">{app.job_title}</p>
                    </div>

                    {/* Meta elements */}
                    <div className="flex items-center justify-between w-full lg:w-auto pt-4 lg:pt-0 mt-3 lg:mt-0 border-t border-white/5 lg:border-0 gap-4">
                      
                      <div className="flex items-center gap-4">
                        {/* AI Score Badge */}
                        <div className="shrink-0">
                          {app.ai_score !== null ? (
                            <div className={`
                              w-16 h-16 rounded-xl flex flex-col items-center justify-center
                              bg-gradient-to-br shadow-lg
                              ${app.ai_score >= 7 ? 'from-green-500 to-emerald-500' : 
                                app.ai_score >= 5 ? 'from-cyan-500 to-blue-500' : 
                                'from-red-500 to-orange-500'}
                            `}>
                              <span className="text-2xl font-bold text-white leading-none">{app.ai_score}</span>
                              <span className="text-xs text-white/80 mt-1">/10</span>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-surface border border-border">
                              <span className="text-text-muted text-sm">N/A</span>
                            </div>
                          )}
                        </div>

                        {/* Status & Date Stack */}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 shrink-0">
                          {/* Status */}
                          <div>
                            <StatusBadge status={app.status} />
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-2 text-text-secondary text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(app.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* View Arrow */}
                      <motion.div
                        className="text-primary-violet shrink-0 pl-2 lg:pl-0"
                        transition={{ duration: 0.2 }}
                      >
                        <Eye className="w-5 h-5 lg:w-6 lg:h-6" />
                      </motion.div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
