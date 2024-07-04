import { createAction, props } from '@ngrx/store';
import { IArtist } from '../../interfaces/artist';

export const loadArtists = createAction('[Artist] Load Artists');

export const loadArtistsSuccess = createAction(
  '[Artist] Load Artists Success',
  props<{ artists: IArtist[] }>()
);

export const addArtist = createAction(
  '[Artist] Add Artist',
  props<{ artist: IArtist }>()
);

export const filterArtistsByName = createAction(
  '[Artist] Filter Artist By artist name',
  props<{ name: string }>()
);

export const filterArtistsBySearchScore = createAction(
  '[Artist] Filter Artists By Search Score'
);