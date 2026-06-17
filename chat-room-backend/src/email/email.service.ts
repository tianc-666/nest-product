import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }
  async sendEmail({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }) {
    await this.transporter.sendMail({
      from: {
        name: 'ChatRoom',
        address: process.env.SMTP_FROM || 'noreply@chatroom.com',
      },
      to,
      subject,
      text,
    });
  }
}
