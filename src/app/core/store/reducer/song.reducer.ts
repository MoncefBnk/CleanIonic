import { createReducer, on } from '@ngrx/store';
import { ISong } from '../../interfaces/song';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as ActionSong from '../action/song.action';


export interface SongState  extends EntityState<ISong> {
    //loadAlbumsSuccess: boolean   //en cours de chargement ou pas
    songs: ISong[];
    filteredSongs: ISong[];
    load: boolean;
}

export function selectUserId(a: ISong): string {
  return a.id;
}

export function sortByTitle(a: ISong,b: ISong) : number {
    return a.title.localeCompare(b.title);
}


export const adapter: EntityAdapter<ISong> = createEntityAdapter<ISong>({
  selectId: selectUserId,
  sortComparer: sortByTitle,
});

export const initialState: SongState = adapter.getInitialState({
    songs: [],
    filteredSongs: [],
    load: false
  });

export const songReducer = createReducer(
    initialState,
    //on(ActionAlbum.loadAlbums, (state) => ({ ...state })),
    on(ActionSong.loadSongsSuccess, (state, { songs }) => ({ ...state, songs, filteredSongs: songs })),
    on(ActionSong.filterSongsByTitle, (state, { title }) => ({
      ...state,
      filteredSongs: state.songs.filter(song => song.title.toLowerCase().includes(title.toLowerCase()))
    })),
    on(ActionSong.filterSongsBySearchScore, state => ({
      ...state,
      filteredAlbums: [...state.songs].sort((a, b) => b.searchScore - a.searchScore)
    }))
);

// Recupération
export const { selectAll,selectEntities } = adapter.getSelectors();


