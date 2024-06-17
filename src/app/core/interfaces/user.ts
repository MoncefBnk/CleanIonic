import { ISongWithDetails } from "./song";

export type ERole = 'user' | 'artist';

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
  lastPlayed?: ILastPlayed[];
  isActive?:boolean;
}

interface ISearchHistory {
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface ILastPlayed {
  id: string;
  songId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IAccessToken {
  token: string;
  expire: string | Date;
}

export interface IToken {
  access: IAccessToken;
  refresh: IAccessToken;
}

export interface ILastPlayedWithDetails extends ILastPlayed {
  song: ISongWithDetails;
}

export interface IPlaylistWithDetails extends IPlaylist {
  songs: ISongWithDetails;
}
