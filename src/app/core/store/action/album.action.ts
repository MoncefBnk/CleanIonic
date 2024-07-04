import { createAction, props } from '@ngrx/store';
import { IAlbum } from '../../interfaces/album';

export const loadAlbums = createAction('[Album] Load Albums');

export const loadAlbumsSuccess = createAction(
  '[Album] Load Albums Success',
  props<{ albums: IAlbum[] }>()
);

export const addAlbum = createAction(
  '[Album] Add Album',
  props<{ album: IAlbum }>()
);

export const filterAlbumsByTitle = createAction(
  '[Album] Filter Albums By Title',
  props<{ title: string }>()
);

export const filterAlbumsBySearchScore = createAction(
  '[Album] Filter Albums By Search Score'
);

export const incrementAlbumSearchScore = createAction(
  '[Album] Increment Search Score',
  props<{ albumId: string }>()
);