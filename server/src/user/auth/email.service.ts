import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();


const generateInviteURL = (
  invitationToken: string,
) => {
  const host = 'http://localhost:5173';
  const subpath = 'login';

  return `${host}/invitations/${invitationToken}`
};

export class EmailService {

  constructor(private readonly configService: ConfigService) { }

  async sendEmail(to: string, subject: string, html: string) {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    const message = {
      from: `"AutoApp" <${email}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent : %s', info);
    return { msg: info };
  }


  async sendWelcomeEmail(
    to: string,
    name: string,
    invitationToken: string,
  ) {
    const subject = 'Welcome to AutoApp';
    const inviteUrl = generateInviteURL(
      invitationToken,
    );
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta content='text/html; charset=UTF-8' http-equiv='Content-Type' />
        </head>
        <body>
          <p>Hi ${name || ''},</p>
          <span>
            Please use the link below to set up your account and get started.
          </span>
          <br>
          <a href="${inviteUrl}">${inviteUrl}</a>
          <br>
          <p>
            Welcome aboard,<br>
            AutoApp Team
          </p>
        </body>
      </html>
    `;

    return await this.sendEmail(to, subject, html);
  }


}
