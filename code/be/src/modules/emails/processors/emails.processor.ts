import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EMAILS_QUEUE, EmailTemplateNameEnum } from 'src/libs/common/constants';
import { EmailsService } from 'src/modules/emails/emails.service';

@Processor(EMAILS_QUEUE)
export class EmailsProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailsProcessor.name);

  constructor(private readonly emailsService: EmailsService) {
    super();
  }

  async process(
    job: Job<{
      email: string;
      templateName: EmailTemplateNameEnum;
      context: Record<string, any>;
    }>,
  ): Promise<any> {
    console.log(
      `Processing job '${job.name}': Sending email to '${job.data.email}'...`,
    );

    const { email, templateName, context } = job.data;

    return this.emailsService.handleSendEmail(email, templateName, context);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job '${job.name}' completed.`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job '${job.name} failed due to: `, err);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    if (job.attemptsMade > 0) {
      console.error(
        `Retrying job '${job.name}', attempt: ${job.attemptsMade + 1}`,
      );
    }
  }
}
