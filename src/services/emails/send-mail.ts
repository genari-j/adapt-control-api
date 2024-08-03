import nodemailer from 'nodemailer'
import { env } from '../../validators'

export const mailService = async (email: string, subject: string, html: string) => {
  const transport = nodemailer.createTransport({
    host: env.HOST_RESET_PSW as string,
    port: env.PORT_RESET_PSW as number,
    secure: false,
    requireTLS: true,
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
  } catch (err) {
    console.error('Error sending email:', err)
  }
}