const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendPasswordResetEmail = async (to, resetLink) => {
  const templatePath = path.join(__dirname, '../../../templates/tr/passwordReset.html');
  const source = fs.readFileSync(templatePath, 'utf-8').toString();
  const template = handlebars.compile(source);

  const replacements = {
    resetLink,
    companyName:  process.env.TEAM_NAME
  };
  const htmlContent = template(replacements);

  await sendEmail(to, 'Şifre Sıfırlama Talebi', htmlContent);
};

const sendPasswordChangedEmail = async (to, resetTime) => {
    const templatePath = path.join(__dirname, '../../../templates/tr/passwordChanged.html');
    const source = fs.readFileSync(templatePath, 'utf-8').toString();
    const template = handlebars.compile(source);
  
    const replacements = {
      resetTime,
      companyName:  process.env.TEAM_NAME
    };
    const htmlContent = template(replacements);
  
    await sendEmail(to, 'Şifre Yenileme Bildirimi', htmlContent);
  };
  

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail
};