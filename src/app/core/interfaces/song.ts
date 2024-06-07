import { IAlbum } from "./album";
import { IArtist } from "./artist";

export interface ISong {
    id: string;
    title: string;
    duration: number;
    cover: string;
    fileUrl: string;
    artistId: string;
    albumId: string;
    createdAt: Date;
    updatedAt: Date;
    searchScore: number;
    lastUpdatedSearchScore: Date;
  }

export interface ISongWithDetails extends ISong {
    artist: IArtist;
    album: IAlbum;
  }