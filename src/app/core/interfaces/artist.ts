import { IAlbum } from "./album";

export interface IArtist {
    id: string;
    userId: string;
    artist: string;
    label: string;
    description: string;
    avatar: string;
    searchScore : number;
    followers: number;
    lastUpdatedSearchScore: Date;
    createdAt: Date;
    updatedAt: Date;
    albums?: string[];
  }

  export interface IArtistWithDetails extends IArtist {
    artistDetail: IAlbum;
  }