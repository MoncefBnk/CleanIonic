import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import { AlbumState, albumReducer } from './reducer/album.reducer';
import { SongState, songReducer } from './reducer/song.reducer';
import { UserState, userReducer } from './reducer/user.reducer';
import { ArtistState, artistReducer } from './reducer/artist.reducer';

export interface AppState {
  albums: AlbumState;
  songs: SongState;
  lastPlayeds: UserState;
  artists: ArtistState;
}

export const reducers: ActionReducerMap<AppState> = {
  albums: albumReducer,
  songs: songReducer,
  lastPlayeds: userReducer,
  artists: artistReducer,
}
