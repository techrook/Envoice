export const CONSTANT = {
  CREDS_TAKEN: 'Credentials taken',
  USERNAME_TAKEN: 'Ouch! Username is Taken',
  onUserRegister: 'user.register',
  CONFIRM_MAIL_SENT: (mail: string) =>
    `A confirmation email has been successfully sent to ${mail}. Please check your inbox and click the provided link to complete the process.`,
  sendConfirmationMail: 'confirmation.mail.request',
  onEmailConfirmationSend: 'user.confirmation.mail.send',
  onEmailConfirmation: 'user.confirmed.mail',
  onPasswordChange: 'user.password.change.success',
  AuthQ: 'auth-queue',
  onUserLogin: 'user.login',
  onPasswordReset: 'user.password.reset.success',
  INCORRECT_CREDS: 'Incorrect Credentials',
  MAIL_UNVERIFIED: 'Email has not been verified',
  OOPS: `Ooops! Something went wrong, this is not you!`,
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  REFRESH_TOKEN_EXPIRED: 'Refresh token expired',
  REFRESH_TOKEN_NOTFOUND: 'Refresh token not found',
  REFRESH_TOKEN_NOTFORUSER: 'Refresh token does not belong to the user',
};

export const MAIL = {
  noreply: 'noreply@Envoice.ng',
  waitListSubject: 'Welcome to Envoice App',
  waitListFrom: 'The Envoice Team',
  urlLogin: "Envoice Login: Here's the secure login link you requested",
  passwordReset: 'Envoice: Password  Reset',
  confirmEmail: 'Envoice: Email Verification',
  welcomeMail: 'Envoice: Welcome Onboard',
  passswordChange:
    'Envoice Security: Your Password has been changed successfully',
};