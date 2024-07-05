import { Timestamp } from "firebase/firestore/lite";
import { ISong } from "./song";
import { IArtist } from "./artist";

export interface IAlbum {
    id: string;
    title: string;
    artistId: string;
    releaseDate: Date;
    cover: string;
    searchScore : number;
    category: string;
    year: number;
    lastUpdatedSearchScore: Date;
    createdAt: Date;
    updatedAt: Date;
    song?: string[];
  }
  export interface IAlbumsWithArtistAndSong extends IAlbum {
    songs: ISong[];
  }

  export interface IAlbumsWithDetails extends IAlbum {
    artist: IArtist;
  }

 