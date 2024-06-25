const { sendEmail } = require('./services/email/services/emailService'); // mailService.js dosyasının doğru yolunu buraya yazın

const main = async () => {
  const to = 'dev.burak@gmail.com'; // Alıcı e-posta adresi
  const subject = 'Test Email'; // E-posta konusu
  const htmlContent = '<p>This is a test email sent from Node.js using Nodemailer.</p>'; // E-posta içeriği

  try {
    await sendEmail(to, subject, htmlContent);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

main();
