type ERole = 'user' | 'artist';

export interface IUser {
  role: ERole;
  isEmailVerified: boolean;
  email: string;
  name: string;
  id: string;
}

interface IAccessToken {
  token: string;
  expire: string | Date;
}

export interface IToken {
  access: IAccessToken;
  refresh: IAccessToken;
}
