import { createAction, props } from '@ngrx/store';
import { ISong } from '../../interfaces/song';

export const loadSongs = createAction('[Song] Load Songs');

export const loadSongsSuccess = createAction(
  '[Album] Load Albums Success',
  props<{ songs: ISong[] }>()
);


export const filterSongsByTitle = createAction(
  '[Album] Filter Songs By Title',
  props<{ title: string }>()
);

export const filterSongsBySearchScore = createAction(
  '[Album] Filter Songs By Search Score'
);