export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface Enable2FAResponseDto {
  secret: string;
  qrCodeUrl: string;
}

export interface Verify2FADto {
  code: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}
