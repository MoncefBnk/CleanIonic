import { createAction, props } from '@ngrx/store';
import { ISong } from '../../interfaces/song';

export const loadSongs = createAction('[Song] Load Songs');

export const loadSongsSuccess = createAction(
  '[Song] Load Songs Success',
  props<{ songs: ISong[] }>()
);


export const filterSongsByTitle = createAction(
  '[Song] Filter Songs By Title',
  props<{ title: string }>()
);

export const filterSongsBySearchScore = createAction(
  '[Song] Filter Songs By Search Score'
);

export const incrementSongSearchScore = createAction(
  '[Song] Increment Search Score',
  props<{ songId: string }>()
);