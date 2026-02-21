import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import { cn } from '../lib/utils';

interface AIFeedbackProps {
  score: number | null;
  feedback: string;
  isLoading?: boolean;
}



const getScoreGradient = (score: number) => {
  if (score >= 8) return 'from-green-500 to-emerald-500';
  if (score >= 6) return 'from-cyan-500 to-blue-500';
  if (score >= 4) return 'from-violet-500 to-purple-500';
  return 'from-red-500 to-orange-500';
};

const getScoreIcon = (score: number) => {
  if (score >= 7) return TrendingUp;
  if (score >= 4) return Minus;
  return TrendingDown;
};

const AIFeedback: React.FC<AIFeedbackProps> = ({ score, feedback, isLoading = false }) => {
  if (isLoading) {
    return (
      <GlassCard className="p-6 relative overflow-hidden" glow glowColor="violet">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary-violet to-transparent"
            animate={{
              y: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-6 h-6 text-primary-violet" />
          </motion.div>
          <p className="text-text-secondary">AI is analyzing your application...</p>
        </div>
      </GlassCard>
    );
  }

  if (score === null) {
    return null;
  }

  const scoreGradient = getScoreGradient(score);
  const ScoreIcon = getScoreIcon(score);

  return (
    <GlassCard 
      className="p-6 relative overflow-hidden" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${scoreGradient} opacity-5`} />
      {/* Scanning laser animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={cn(
            'absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-30',
          )}
          animate={{
            y: ['0%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Score Badge */}
        <motion.div
          className={cn(
            'flex-shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center',
            'bg-gradient-to-br',
            scoreGradient,
            'shadow-lg'
          )}
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <ScoreIcon className="w-6 h-6 text-white mb-1" />
          <span className="text-2xl font-bold text-white">{score}</span>
          <span className="text-xs text-white/80">/ 10</span>
        </motion.div>

        {/* Feedback Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary-violet" />
            <h3 className="text-lg font-semibold text-text-primary">AI Evaluation</h3>
          </div>
          <p className="text-text-secondary leading-relaxed">{feedback}</p>
        </div>
      </div>

      {/* Glow effect overlay */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300',
        'bg-gradient-to-br',
        scoreGradient,
        'pointer-events-none'
      )} />
    </GlassCard>
  );
};

export default AIFeedback;
