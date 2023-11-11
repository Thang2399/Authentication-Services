export interface IUserInterface {
  id?: string;
  userName: string;
  email: string;
  password: string;
  gender: string;
  role: string;
  phoneNumber: string;
  createdAt?: string;
}

export interface IGoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken?: string;
}

