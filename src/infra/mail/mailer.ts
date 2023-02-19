import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { IMailer, MailerDTO } from '../../application/contracts/mailer'

@Injectable()
export class Mailer implements IMailer {
  private readonly transporter!: nodemailer.Transporter

  constructor () {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    } as any)
  }

  async send (mail: MailerDTO.Mail): Promise<void> {
    let html = fs.readFileSync(
      path.resolve(__dirname, 'templates', `${mail.htmlTemplate}.html`),
      'utf-8'
    )
    for (const key in mail.data) {
      html = html.replace(`{{${key}}}`, mail.data[key])
    }
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: mail.to,
      subject: mail.subject,
      html
    })
  }
}
