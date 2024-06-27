import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, adapter } from '../reducer/user.reducer';
import { AppState } from '../app.state';


export const selectStore = (state: AppState) => state.lastPlayeds;
export const selectLastPlayed  = createFeatureSelector<UserState>('lastPlayeds');


export const selectLastPlayeds = createSelector(
    selectLastPlayed,
  (state: UserState) => state.lastPlayeds || []
);



