// import nodemailer from 'nodemailer';

import { Config } from '@/config';
import { createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

export const sendMail = async (to: string, subject: string, text: string, html: string) => {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: Config.EMAILID,
      pass: Config.PASSWORD
    }
  });
  const mailOptions: Options = {
    from: Config.EMAILID,
    to: to,
    subject: subject,
    text: text,
    html: html
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: ', info.messageId);
    return { message: 'Email sent successfully', status: true };
  } catch (error) {
    console.log('Error sending email: ', error);
    return { message: 'Error sending email', status: false };
  }
};

export const sendVerificationMail = (to: string, token: string) => {
  const subject = 'Email Verification - Tweepspace';
  const text = `Click on the link to verify your email`;
  const html = `<html>
  <head>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
          }
          .content {
              font-size: 16px;
              line-height: 1.5;
              color: #333333;
          }
          .button {
              display: inline-block;
              background-color: #007bff;
              color: white;
              border-radius:10px;
              padding: 10px 20px;
              text-decoration: none;
              width: 120px;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="content">
              <div style="display:flex; justify-content:center;"><img src="https://tweepspace.vercel.app/tweeps.png" alt="tweepspace" width="100px" height="100px" style="border-radius: 10px;" ></div>
              <h1 class="heading">Welcome to Tweepspace!</h1>
              <p>Thank you for signing up with us. To complete your registration, please verify your email address by clicking the button below.</p>
              <p><a href=${Config.SITEURL}/api/auth/verify/${token} class="button">Verify Email</a></p>
              <p>If you did not sign up with us, please ignore this email.</p><br>
              <p>If you found any trouble in verification, try copy and paste below link in browser.</p>
              <p>${Config.SITEURL}/api/auth/verify/${token}</p>
              <br>
              <p>Feel free to contact us on our <a href="mailto:${Config.EMAILID}?subject=Feedback">email</a>
               if you have any questions.</p>
              <p>Best regards,</p>
              <p>Tweepspace Team</p>
          </div>
      </div>
  </body>
  </html>`;
  return sendMail(to, subject, text, html);
};
