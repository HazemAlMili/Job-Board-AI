import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { jobsService } from '../../services/jobs.service';
import type { Job } from '../../types';
import JobCard from '../../components/JobCard';
import LoadingAI from '../../components/LoadingAI';

const JobsListing: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobsService.getActiveJobs();
      setJobs(data);
    } catch {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate random match scores for demo (in production, this would come from AI)
  const getMatchScore = (index: number) => {
    const scores = [95, 88, 82, 76, 71, 68, 65, 62, 58, 55];
    return scores[index % scores.length];
  };

  if (loading) return <LoadingAI fullPage message="Finding your perfect matches..." />;

  // Animation variants
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary-violet/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-cyan/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="w-6 h-6 text-primary-violet" />
            <span className="text-primary-cyan font-semibold">AI-Powered Job Matching</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Find Your{' '}
            <span className="bg-gradient-to-r from-primary-violet via-primary-cyan to-primary-violet bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Dream Job
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl text-text-secondary mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Discover opportunities matched to your skills with AI-powered analysis
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search jobs by title, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-primary-violet focus:ring-2 focus:ring-primary-violet/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
              />
            </div>
          </motion.div>

          {/* Filter Tags */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-3 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {['Remote', 'Full Time', 'Engineering', 'Design', 'Marketing'].map((tag, index) => (
              <motion.button
                key={tag}
                onClick={() => setSearchTerm(prev => prev.toLowerCase().includes(tag.toLowerCase()) ? '' : tag)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  searchTerm.toLowerCase().includes(tag.toLowerCase())
                    ? 'bg-gradient-to-r from-primary-violet to-primary-cyan text-white shadow-glow'
                    : 'bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:border-white/20 hover:text-white hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <motion.div 
            className="alert alert-error mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.div>
        )}

        {filteredJobs.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full backdrop-blur-glass border border-border flex items-center justify-center">
              <Search className="w-12 h-12 text-text-muted" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">No jobs found</h3>
            <p className="text-text-secondary mb-6">Try adjusting your search criteria</p>
            <motion.button
              onClick={() => setSearchTerm('')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-white font-semibold"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Search
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-text-secondary">
                Showing <span className="text-text-primary font-semibold">{filteredJobs.length}</span>{' '}
                {filteredJobs.length === 1 ? 'job' : 'jobs'}
              </p>
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <Sparkles className="w-4 h-4 text-primary-violet" />
                <span>Sorted by AI match score</span>
              </div>
            </motion.div>

            {/* Bento Grid Layout */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  className={
                    // Make some cards span 2 columns for visual interest
                    index % 7 === 0 ? 'md:col-span-2' : ''
                  }
                >
                  <JobCard
                    job={job}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    matchScore={getMatchScore(index)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobsListing;
