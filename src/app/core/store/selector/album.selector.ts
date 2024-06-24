import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlbumState, adapter } from '../reducer/album.reducer';
import { AppState } from '../app.state';


export const selectStore = (state: AppState) => state.albums;
export const selectAlbumState = createFeatureSelector<AlbumState>('albums');

//const { selectAll, selectEntities } = adapter.getSelectors(selectAlbumState);

/*

export const selectAllAlbums = createSelector(
  selectAlbumState,
  selectAll
);*/
export const selectAllAlbums = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.albums
);



export const selectFilteredAlbums = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.filteredAlbums
);