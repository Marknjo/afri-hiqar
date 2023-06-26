'use server'

/* eslint-disable class-methods-use-this */

/* eslint-disable consistent-return */

// @ts-ignore

/**
 * Send Email Feature with Nodemon
 *
 * -> constructor
 *
 * -> _buildTransport
 *
 * -> send universal function
 *
 * -> sendWelcome
 *
 * -> sendConfirmationAccount
 *
 * -> sendPasswordReset
 */
// import path from 'path'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { env } from 'process'
import { createTransport } from 'nodemailer'
import { renderFile } from 'pug'

import { htmlToText } from 'html-to-text'

import Mail from 'nodemailer/lib/mailer'
import { BadRequestException } from '@lib/exceptions/BadRequestException'

interface IEmailOptions {
  url?: string
  subject?: string
  recipient?: { email: string; name: string }
  message?: string
  payload?: { [key: string]: any }
}

class Email {
  from: string

  to: string | boolean

  recipientName: string | boolean

  message: string | boolean

  subject: string | boolean

  url: string | boolean

  payload: { [key: string]: any }

  /**
   * Initialize email options
   * @param options Email constructor options
   */
  constructor(
    options: IEmailOptions = {
      recipient: { email: '', name: '' },
      url: '',
      message: 'Message',
      subject: '',
    },
    isContact?: boolean,
  ) {
    // Initialize from
    this.from = `${env.APP_USER!} <${env.APP_USER_EMAIL!}>`

    // Initialize to
    this.to = this.setToRecipient(!!isContact, options)

    // initialize user name
    this.recipientName = options.recipient
      ? options.recipient.name.split(' ').at(0)!
      : false

    // initialize message
    this.message = options.message ? options.message : false

    // Initialize subject
    this.subject = options.subject ? options.subject : false

    /// set additional unknown payload data
    this.payload = options.payload ? options.payload : {}

    // Initialize url
    this.url = options.url ? options.url : false
  }

  private setToRecipient(isContact: boolean, options: IEmailOptions) {
    if (isContact) return env.APP_ADMIN_EMAIL!
    return options.recipient ? options.recipient.email : false
  }

  /**
   * Build transport based on the environnement variable
   *
   * Use sendGrid if on production
   *
   * Use Mailtrap is on development
   */
  // eslint-disable-next-line class-methods-use-this
  private buildTransport() {
    const isNotProd = env.NODE_ENV !== 'production'
    const isNotDev = env.NODE_ENV !== 'development'

    if (isNotDev && isNotProd) return false

    // Based on production
    if (env.NODE_ENV === 'production') {
      // Send mail using sendGrid settings
      const host = env.BREVO_HOST || false
      const port = env.BREVO_PORT || false
      const user = env.BREVO_USER || false
      const pass = env.BREVO_PASS || false

      if (!user || !pass || !port || !host) return false

      return createTransport({
        /* @ts-ignore */
        host,
        port,
        auth: {
          user,
          pass,
        },
      })
    }

    /// check for dev env
    const host = env.ETHEREAL_HOST || false
    const port = env.ETHEREAL_PORT || false
    const user = env.ETHEREAL_USER || false
    const pass = env.ETHEREAL_PASS || false

    if (!user || !pass || !port || !host) return false

    // Based on development
    // use ethereal/mailtrap for testing
    return createTransport({
      /* @ts-ignore */
      host,
      port,
      auth: {
        user,
        pass,
      },
    })
  }

  /**
   * Send email
   * @param subject Default email subject
   * @param template Template name for pug html
   */
  async send(subject: string, template: string) {
    try {
      const transport = this.buildTransport()

      if (!transport) return

      /// Prep template url path
      const templateUrl = resolve(
        process.cwd(),
        'src',
        'views',
        `emails/${template}.pug`,
      )

      if (!existsSync(templateUrl))
        throw new BadRequestException(
          `Server Error: Could not load email template for ${template}`,
          500,
        )

      /// load local email template from a pug file
      let html: string
      try {
        html = renderFile(templateUrl, {
          ...(this.recipientName ? { name: this.recipientName } : {}),
          ...(this.url ? { url: this.url } : {}),
          ...(this.message ? { message: this.message } : {}),
          ...this.payload,
        } as { name?: string; url?: string; message?: string })
      } catch (error: unknown) {
        const err = error as Error
        throw new BadRequestException(err.message.replace(/Error: /, ''), 500)
      }

      // Prep email Options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html),
      }

      // Send Email
      await transport.sendMail(mailOptions as Mail.Options)
    } catch (error) {
      throw error
    }
  }

  /**
   * Send a welcome message
   * @returns Email Instance of This class
   */
  async sendWelcomeMessage() {
    // set subject
    const setSubject = this.subject
      ? (this.subject as string)
      : 'Welcome to AfriHiqar family 🤗🤗🤗'

    await this.send(setSubject, 'welcomeEmail')
    return this
  }

  /**
   * Send a email confirmation message
   * @returns Email Instance of This class
   */
  async sendConfirmAccount() {
    // set subject
    const setSubject = this.subject
      ? (this.subject as string)
      : `📝📝📝 ${this.recipientName} please confirm your account!`

    await this.send(setSubject, 'confirmAccountEmail')
    return this
  }

  /**
   * Send a email confirmation message
   * @returns Email Instance of This class
   */
  async sendPasswordReset() {
    // set subject
    const setSubject = this.subject
      ? (this.subject as string)
      : 'Request For Account Password Reset (⏰ expires in 10 minutes)'

    await this.send(setSubject, 'passwordResetEmail')
    return this
  }

  /**
   * Send account confirmation message
   * @returns Email Instance of This class
   */
  async sendAccountConfirmed() {
    // set subject
    const setSubject = this.subject
      ? (this.subject as string)
      : '😊😊😊 We are so thrilled you have confirmed your account'

    await this.send(setSubject, 'accountConfirmedEmail')
    return this
  }

  async contactMe(topic: string) {
    const setSubject = `You Have a New Message from ${this.recipientName} about (${topic})`

    await this.send(setSubject, 'contactMe')
    return this
  }
}

// Export
export default Email
