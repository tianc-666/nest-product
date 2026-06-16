import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '935700953@qq.com',
        pass: 'otwpwcwfaopobdca',
      },
    });
  }
  // 调用qq邮箱发送邮件
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
        name: 'Chat Room',
        address: '935700953@qq.com',
      },
      to,
      subject,
      text,
    });
  }
}
