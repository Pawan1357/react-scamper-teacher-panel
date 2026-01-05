export const ROUTES = {
  default: `/`,
  pageNotFound: `/404`,
  signIn: `/signIn`,
  signUp: `/signUp`,
  changePassword: `/change-password`,
  forgotPassword: `/forgot-password`,
  myAccount: `/myAccount`,
  dashboard: `/dashboard`,
  resetPassword: (token: string) => `/reset-password/${token}`,
  setupPassword: (token: string) => `/setup-password/${token}`,
  cleverCallback: `/auth/clever/callback`
};
