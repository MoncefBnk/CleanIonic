import { ISong } from "./song";

export interface IAlbum {
    id: number;
    nom: string;
    categ: string;
    label: string;
    cover: string;
    year: string;
    createdAt: Date;
    songs?: ISong[];
  }