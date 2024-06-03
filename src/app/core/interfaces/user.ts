type ERole = 'user' | 'artist';

export interface IUser {
  role: ERole;
  isEmailVerified: boolean;
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  dateBirth: Date;
  phoneNumber?: string;
  followers: number;
  isArtist: boolean;
  createdAt: Date;
  updatedAt: Date;
  searchHistory?: ISearchHistory[];
  playlist?: IPlaylist[];
}

interface ISearchHistory {
  id: string;
  type: string;
}

export interface IPlaylist {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  song: string [];
  playedScore: number;
  lastUpdatedPlayedScore: Date;
}

interface IAccessToken {
  token: string;
  expire: string | Date;
}

export interface IToken {
  access: IAccessToken;
  refresh: IAccessToken;
}
