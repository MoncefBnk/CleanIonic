import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SongState, adapter } from '../reducer/song.reducer';
import { AppState } from '../app.state';


export const selectStore = (state: AppState) => state.songs;
export const selectSongState = createFeatureSelector<SongState>('songs');


export const selectAllSongs = createSelector(
  selectSongState,
  (state: SongState) => state.songs
);



export const selectFilteredSongs = createSelector(
    selectSongState,
  (state: SongState) => state.filteredSongs
);