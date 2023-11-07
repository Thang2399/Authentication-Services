import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IUserInterface } from '@/src/interface/user.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailResetPasswordLink(user: IUserInterface, token = '') {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'The Fake Shop Ecommerce reset password email',
      template: 'reset-password', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.userName,
        url,
      },
    });
  }
}
