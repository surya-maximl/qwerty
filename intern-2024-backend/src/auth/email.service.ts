import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  generateInviteURL,
  generateOrgInviteURL,
} from 'src/helpers/utils.helper';
import * as dotenv from 'dotenv';
dotenv.config();

export class EmailService {
  constructor(private readonly configService: ConfigService) {}

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
      from: `"Tooljet" <${email}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent : %s', info);
  }

  async sendWelcomeEmail(
    to: string,
    name: string,
    invitationToken: string,
    organizationInvitationToken?: string,
    organizationId?: string,
    organizationName?: string,
    sender?: string,
  ) {
    const subject = 'Welcome to ToolJet';
    const inviteUrl = generateInviteURL(
      invitationToken,
      organizationInvitationToken,
      organizationId,
    );
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta content='text/html; charset=UTF-8' http-equiv='Content-Type' />
        </head>
        <body>
          <p>Hi ${name || ''},</p>
          ${
            organizationInvitationToken && sender && organizationName
              ? `<span>
              ${sender} has invited you to use ToolJet workspace: ${organizationName}.
            </span>`
              : ''
          }
          <span>
            Please use the link below to set up your account and get started.
          </span>
          <br>
          <a href="${inviteUrl}">${inviteUrl}</a>
          <br>
          <p>
            Welcome aboard,<br>
            ToolJet Team
          </p>
        </body>
      </html>
    `;

    await this.sendEmail(to, subject, html);
  }

  async sendOrganizationUserWelcomeEmail(
    to: string,
    name: string,
    sender: string,
    invitationtoken: string,
    organizationName: string,
  ) {
    const subject = 'Welcome to ToolJet';
    const inviteUrl = generateOrgInviteURL(invitationtoken);
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta content='text/html; charset=UTF-8' http-equiv='Content-Type' />
        </head>
        <body>
          <p>Hi ${name || ''},</p>
          <br>
          <span>
          ${sender} has invited you to use ToolJet workspace: ${organizationName}. Use the link below to set up your account and get started.
          </span>
          <br>
          <a href="${inviteUrl}">${inviteUrl}</a>
          <br>
          <br>
          <p>
            Welcome aboard,<br>
            ToolJet Team
          </p>
        </body>
      </html>
    `;

    await this.sendEmail(to, subject, html);
  }
}
