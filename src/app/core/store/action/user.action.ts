import { createAction, props } from '@ngrx/store';
import { ILastPlayedWithDetails } from '../../interfaces/user';

export const loadLastPlayed  = createAction('[User] [User] Load Last Played',
    props<{ userId: string }>());

export const loadLastPlayedSuccess = createAction(
  '[User] Load Last Played Success',
  props<{ lastPlayeds: ILastPlayedWithDetails[] }>()
);
