export interface IMailer {
  send: (input: MailerDTO.Mail) => Promise<void>
}

export namespace MailerDTO {
  export type Mail = {
    to: string
    subject: string
    data: any
    htmlTemplate: string
  }
}
