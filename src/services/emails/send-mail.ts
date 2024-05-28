import nodemailer from 'nodemailer'
import { env } from '../../validators'

export const mailService = async (email: string, subject: string, html: any) => {
  const transport = nodemailer.createTransport({
    host: env.HOST_RESET_PSW as string,
    port: env.PORT_RESET_PSW as number,
    secure: false, // use TLS
    requireTLS: true, // require a secure connection
    auth: {
      user: env.EMAIL_RESET_PSW as string,
      pass: env.PSW_RESET_PSW as string
    }
  })

  const mailOptions = {
    from: env.EMAIL_RESET_PSW as string,
    to: email,
    subject,
    html
  }

  try {
    const info = await transport.sendMail(mailOptions)
    console.log('Email sent:', info.response)
  } catch (err: any) {
    console.error('Error sending email:', err)
  }
}