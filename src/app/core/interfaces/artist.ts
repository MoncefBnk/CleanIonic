import { IAlbum, IAlbumsWithArtistAndSong, IAlbumsWithDetails } from "./album";
import { ISongWithDetails } from "./song";

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

 

  export interface IArtistWithAlbumsAndSongs extends IArtist {
    albumsDetail: IAlbum[];
    songs: ISongWithDetails[];
  }

  export interface IArtistWithDetails extends IArtist {
    artistDetail: IAlbum;
  }

  

