import { Injectable } from '@nestjs/common';
import { IUserInterface } from '@/src/shared/interface/user.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  // constructor(private mailerService: MailerService) {}

  private transporter = nodemailer.createTransport({
    host: process.env.SEND_EMAIL_HOST,
    port: 587,
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.AUTH_EMAIL_USER,
      pass: process.env.AUTH_EMAIL_PASSWORD,
    },
  });

  async sendEmailResetPasswordLink(
    user: IUserInterface,
    token = '',
    callbackUrl = '',
  ) {
    const url = `${callbackUrl}?token=${token}`;
    console.log('sendEmailResetPasswordLink', url);

    await this.transporter.sendMail({
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
