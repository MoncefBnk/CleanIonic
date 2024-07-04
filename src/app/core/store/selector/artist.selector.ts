import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ArtistState, adapter } from '../reducer/artist.reducer';
import { AppState } from '../app.state';


export const selectStore = (state: AppState) => state.artists;
export const selectArtistState = createFeatureSelector<ArtistState>('artists');


export const selectAllArtists = createSelector(
    selectArtistState,
  (state: ArtistState) => state.artists
);



export const selectFilteredArtists = createSelector(
    selectArtistState,
  (state: ArtistState) => state.filteredArtists
);