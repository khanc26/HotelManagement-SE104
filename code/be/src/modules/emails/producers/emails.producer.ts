import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  BULLMQ_RETRY_DELAY,
  BULLMQ_RETRY_LIMIT,
  EMAILS_QUEUE,
  EmailTemplateNameEnum,
} from 'src/libs/common/constants';

@Injectable()
export class EmailsProducer {
  constructor(@InjectQueue(EMAILS_QUEUE) private readonly emailsQueue: Queue) {}

  public handleSendEmail = async (
    email: string,
    templateName: EmailTemplateNameEnum,
    context: Record<string, any>,
  ) => {
    await this.emailsQueue.add(
      'send-email',
      {
        email,
        templateName,
        context,
      },
      {
        attempts: BULLMQ_RETRY_LIMIT,
        backoff: { type: 'exponential', delay: BULLMQ_RETRY_DELAY },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  };
}
