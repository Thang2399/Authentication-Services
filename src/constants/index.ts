const AUTHENTICATION = {
  CREATE_SUCCESS: 'create user success',
  UPDATE_SUCCESS: 'update user success',
  DELETE_SUCCESS: 'delete user success',

  CREATE_ERROR: 'create user error',
  UPDATE_ERROR: 'update user error',
  DELETE_ERROR: 'delete user error',
};

const LOGIN = {
  LOGIN_SUCCESS: 'login success',
  WRONG_USER_EMAIL_OR_PASSWORD: 'wrong user email or password',
  USER_NOT_EXIST: 'user not exist',
};

const FORGET_RESET_PASSWORD = {
  SEND_EMAIL_SUCCESS: 'send email success',
  SEND_EMAIL_FAIL: 'send email',

  RESET_PASSWORD_SUCCESS: 'reset password successfully',
  RESET_PASSWORD_FAIL: 'reset password failed',

  WRONG_OTP: 'wrong otp',
  WRONG_EMAIL: 'wrong email',
  NOT_FOUND_EMAIL: 'not found email',
  TOKEN_IS_INVALID: 'token is invalid',
};

export const HTTP_RESPONSE_MESSAGE = {
  AUTHENTICATION: { ...AUTHENTICATION },
  LOGIN: { ...LOGIN },
  FORGET_RESET_PASSWORD: { ...FORGET_RESET_PASSWORD },

  SERVER_ERROR: 'internal server error',
};
