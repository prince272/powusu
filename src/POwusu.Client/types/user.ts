export type User = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  createdAt: string;
  updatedAt: string | null;
  roles: string[];
  connected: boolean;
  authenticated: boolean;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};
