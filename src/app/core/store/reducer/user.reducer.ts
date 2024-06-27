import { State, createReducer, on } from '@ngrx/store';
import { ILastPlayedWithDetails } from '../../interfaces/user';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as ActionUser from '../action/user.action';


export interface UserState  extends EntityState<ILastPlayedWithDetails> {
    //loadAlbumsSuccess: boolean   //en cours de chargement ou pas
    lastPlayeds: ILastPlayedWithDetails[];
    load: boolean;
}


export const adapter: EntityAdapter<ILastPlayedWithDetails> = createEntityAdapter<ILastPlayedWithDetails>({

});

export const initialState: UserState = adapter.getInitialState({
    lastPlayeds: [],
    load: false
  });

export const userReducer = createReducer(
    initialState,
    //on(ActionAlbum.loadAlbums, (state) => ({ ...state })),
    on(ActionUser.loadLastPlayedSuccess, (state, { lastPlayeds }) => ({
        ...state,
        lastPlayeds
      })),
);

// Recupération
export const { selectAll,selectEntities } = adapter.getSelectors();


