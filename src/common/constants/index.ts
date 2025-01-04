export const CONSTANT = {
    CREDS_TAKEN: 'Credentials taken',
    USERNAME_TAKEN: 'Ouch! Username is Taken',
    onUserRegister: 'user.register',
    CONFIRM_MAIL_SENT: (mail) =>
        `A confirmation email has been successfully sent to ${mail}. Please check your inbox and click the provided link to complete the process.`,
    sendConfirmationMail: 'confirmation.mail.request',
    onPasswordChange: 'user.password.change.success',
    AuthQ: 'auth-queue',
    onUserLogin: 'user.login',
    onPasswordReset: 'user.password.reset.success',
    INCORRECT_CREDS: 'Incorrect Credentials',
    MAIL_UNVERIFIED: 'Email has not been verified',
    OOPS: `Ooops! Something went wrong, this is not you!`,
}


export const MAIL = {
    noreply: 'noreply@playlistswap.ng',
    waitListSubject: 'Welcome to Playlist Swap',
    waitListFrom: 'The Swap Crew',
    urlLogin: "PlaylistSwap Login: Here's the secure login link you requested",
    passwordReset: 'Playlist Swap: Password  Reset',
    confirmEmail: 'Envoice: Email Verification',
    welcomeMail: 'PlaylistSwap: Welcome Onboard',
    passswordChange:
      'PlaylistSwap Security: Your Password has been changed successfully',
    subscriptionSuccessfulMail:
      'Subscription Successful! Welcome to Playlist Swap',
    subscriptionDeActivate: 'Subscription DeActivated',
    TwoDayExpiryReminder: 'Playlist Swap: Your Subscription expires in Two days',
    FiveDayExpiryReminder:
      'Playlist Swap: Your Subscription expires in Five days',
  };
