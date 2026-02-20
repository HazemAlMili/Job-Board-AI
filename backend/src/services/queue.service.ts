import { ApplicationModel } from '../models/application.model';
import { JobModel } from '../models/job.model';
import { OpenRouterService } from './openrouter.service';

const AI_SCORE_THRESHOLD = parseInt(process.env.AI_SCORE_THRESHOLD || '5', 10);

/**
 * In-memory queue for processing resume AI evaluations
 */
class EvaluationQueue {
  private processing = false;
  private queue: number[] = [];

  async add(applicationId: number): Promise<void> {
    this.queue.push(applicationId);
    console.log(`📥 Application ${applicationId} queued. Queue size: ${this.queue.length}`);
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.processing = true;
    while (this.queue.length > 0) {
      const applicationId = this.queue.shift();
      if (applicationId) {
        await this.evaluateApplication(applicationId);
      }
    }
    this.processing = false;
  }

  private async evaluateApplication(applicationId: number): Promise<void> {
    try {
      console.log(`🤖 Starting evaluation for application ${applicationId}...`);

      // Mark as evaluating
      await ApplicationModel.updateStatus(applicationId, 'evaluating');
      console.log(`- Status updated to evaluating for ${applicationId}`);

      const application = await ApplicationModel.findById(applicationId);
      if (!application) {
        console.error(`- Error: Application ${applicationId} not found in DB`);
        return;
      }
      console.log(`- Found application for ${application.full_name}`);

      const job = await JobModel.findById(application.job_id);
      if (!job) {
        console.error(`- Error: Job ${application.job_id} not found for app ${applicationId}`);
        await ApplicationModel.updateEvaluation(
          applicationId,
          0,
          'The job listing for this application could not be found.',
          'rejected'
        );
        return;
      }
      console.log(`- Found job: ${job.title}`);

      // resume_path is now a Supabase Storage public URL
      const evaluation = await OpenRouterService.evaluateResume(application.resume_path, job);

      // Score < threshold → auto-reject with feedback
      // Score >= threshold → under_review by HR with feedback
      const newStatus: 'rejected' | 'under_review' =
        evaluation.score < AI_SCORE_THRESHOLD ? 'rejected' : 'under_review';

      await ApplicationModel.updateEvaluation(
        applicationId,
        evaluation.score,
        evaluation.feedback,
        newStatus
      );

      console.log(
        `✅ Application ${applicationId} evaluated: Score ${evaluation.score}/10 → ${newStatus}`
      );
    } catch (error) {
      console.error(`❌ Error evaluating application ${applicationId}:`, error);
      await ApplicationModel.updateEvaluation(
        applicationId,
        0,
        'An error occurred during AI evaluation. Our team has been notified.',
        'rejected'
      );
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }
}

export const evaluationQueue = new EvaluationQueue();
