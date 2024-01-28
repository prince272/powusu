export type User = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  userName: string;
  title: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  createdAt: string;
  updatedAt: string | null;
  roles: string[];
  connected: boolean;
  authenticated: boolean;
  tokenType: string;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};
