const ApplicationQueue = {
  Authorization: "role_requests_queue",
  Notification: "notifications_queue",
  User: "auth_requests_queue",
  Profile: "profile_requests_queue",
  Media: "media_requests_queue",
};

const convertToCommandPattern = <T extends Record<string, string>>(
  obj: T
): { [K in keyof T]: { cmd: T[K] } } => {
  const entries = Object.entries(obj);
  return entries.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: { cmd: value },
    }),
    {} as { [K in keyof T]: { cmd: T[K] } }
  );
};

const rawMessagePatterns = {
  login: "login-user",
  register: "register-user",
  registerTemp: "register-user-temp",
  submitSocialProfile: "register-social-submit-profile-details",
  resendEmailVerification: "register_email_verification_code_resend",
  verifyEmailOtp: "register_email_verification_code_verify",
  getTempUser: "get_register_temp_user",
  resendNumberVerification: "number_verification_code_resend",
  addNumber: "add_number",
  verifyNumber: "verify_number",
  addPassword: "add_password",
  checkUsername: "username_availablity_check",
  verifyMfa: "mfa_code_verify",
  getTempUserInfo: "get_temp_user_info",
  permissionCheck: "has-permission",
  fetchAllUsers: "findAllUsers",
  fetchAllCompanies: "findAllCompanies",
  getUserProfile: "get-user-profile",
  socialMediaRegister: "register_with_socialMedia",
};

const MessagePatternQueue = convertToCommandPattern(rawMessagePatterns);
const EventPatternQueue = {
  createUserProfile: "create-user-profile",
  emailVerifyNotification: "register_email_verification",
  numberverifyNotification: "register_phone_number_verification",
  companyCreatedDefaultRoleAndMemberCreation: "company_created",
  invitationEmailNotify: "send_invitation",
  invitationAcceptMemberCreation: "create_member",
  loginSessionLog: "add_session_log",
};

const InjectAbleServiceNames = {
  User: "USER_SERVICE",
  Authorization: "AUTHORIZATION_SERVICE",
  Notification: "NOTIFICATION_SERVICE",
  Profile: "PROFILE_SERVICE",
};
export {
  ApplicationQueue,
  MessagePatternQueue,
  convertToCommandPattern,
  rawMessagePatterns,
  EventPatternQueue,
  InjectAbleServiceNames,
};
