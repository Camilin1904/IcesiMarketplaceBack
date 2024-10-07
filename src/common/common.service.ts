import { Injectable } from '@nestjs/common';
//import Mailgun from 'mailgun-js';
import { Twilio } from 'twilio';

/**@Injectable()
export class MailService {
  private mailgun: Mailgun.Mailgun;

  constructor() {
    this.mailgun = Mailgun({
      apiKey: process.env.MAILGUN_API_KEY,  // Store your API key in .env
      domain: process.env.MAILGUN_DOMAIN,   // Store your domain in .env
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const data = {
      from: `Excited User <mailgun@${process.env.MAILGUN_DOMAIN}>`,
      to,
      subject,
      text,
    };

    try {
      await this.mailgun.messages().send(data);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}*/

@Injectable()
export class SmsService {
  private twilio: Twilio;

  constructor() {
    this.twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendSms(to: string, text: string): Promise<void> {
    await this.twilio.messages.create({
      body: text,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  }
}