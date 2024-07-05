import { createReducer, on } from '@ngrx/store';
import { IAlbum } from '../../interfaces/album';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as ActionAlbum from '../action/album.action';


export interface AlbumState  extends EntityState<IAlbum> {
    //loadAlbumsSuccess: boolean   //en cours de chargement ou pas
    albums: IAlbum[];
    filteredAlbums: IAlbum[];
    load: boolean;
}

export function selectUserId(a: IAlbum): string {
  return a.id;
}

export function sortByTitle(a: IAlbum,b: IAlbum) : number {
    return a.title.localeCompare(b.title);
}


export const adapter: EntityAdapter<IAlbum> = createEntityAdapter<IAlbum>({
  selectId: selectUserId,
  sortComparer: sortByTitle,
});

export const initialState: AlbumState = adapter.getInitialState({
    albums: [],
    filteredAlbums: [],
    load: false
  });

export const albumReducer = createReducer(
    initialState,
    //on(ActionAlbum.loadAlbums, (state) => ({ ...state })),
    on(ActionAlbum.loadAlbumsSuccess, (state, { albums }) => ({ ...state, albums, filteredAlbums: albums })),
    on(ActionAlbum.addAlbum, (state, { album }) => ({ ...state, albums: [...state.albums, album], filteredAlbums: [...state.albums, album] })),
    on(ActionAlbum.filterAlbumsByTitle, (state, { title }) => ({
      ...state,
      filteredAlbums: state.albums.filter(album => album.title.toLowerCase().includes(title.toLowerCase()))
    })),
    on(ActionAlbum.filterAlbumsBySearchScore, state => ({
      ...state,
      filteredAlbums: [...state.albums].sort((a, b) => b.searchScore - a.searchScore)
    })),
    on(ActionAlbum.incrementAlbumSearchScore, (state, { albumId }) => {
      const albums = state.albums.map(album =>
        album.id === albumId ? { ...album, searchScore: album.searchScore + 1 } : album
      );
      return { ...state, albums };
    })
);

// Recupération
export const { selectAll,selectEntities } = adapter.getSelectors();


