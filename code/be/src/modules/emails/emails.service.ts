import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
  EmailTemplateNameEnum,
  SUBJECT_EMAIL_MAP,
} from 'src/libs/common/constants';

@Injectable()
export class EmailsService {
  constructor(private readonly mailerService: MailerService) {}

  public handleSendEmail = async (
    email: string,
    templateName: EmailTemplateNameEnum,
    context: Record<string, any>,
  ) => {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: SUBJECT_EMAIL_MAP[templateName],
        template: templateName,
        context,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
