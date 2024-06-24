import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import { AlbumState, albumReducer } from './reducer/album.reducer';
import { SongState, songReducer } from './reducer/song.reducer';

export interface AppState {
  albums: AlbumState;
  songs: SongState;
}

export const reducers: ActionReducerMap<AppState> = {
  albums: albumReducer,
  songs: songReducer
}
