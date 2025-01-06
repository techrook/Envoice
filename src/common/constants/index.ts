export const CONSTANT = {
  CREDS_TAKEN: 'Credentials taken',
  USERNAME_TAKEN: 'Ouch! Username is Taken',
  onUserRegister: 'user.register',
  onEmailConfirmationSend: 'user.confirmation.mail.send',
  CONFIRM_MAIL_SENT: (mail) =>
    `A confirmation email has been successfully sent to ${mail}. Please check your inbox and click the provided link to complete the process.`,
  sendConfirmationMail: 'confirmation.mail.request',
  onPasswordChange: 'user.password.change.success',
  AuthQ: 'auth-queue',
  onUserLogin: 'user.login',
  onPasswordReset: 'user.password.reset.success',
  OOPS: `Ooops! Something went wrong, this is not you!`,
};

export const MAIL = {
  noreply: 'noreply@playlistswap.ng',
  waitListSubject: 'Welcome to Envoice App',
  waitListFrom: 'The Envoice Team',
  urlLogin: "Envoice Login: Here's the secure login link you requested",
  passwordReset: 'Envoice: Password  Reset',
  confirmEmail: 'Envoice: Email Verification',
  welcomeMail: 'Envoice: Welcome Onboard',
  passswordChange:
    'Envoice Security: Your Password has been changed successfully',
};
