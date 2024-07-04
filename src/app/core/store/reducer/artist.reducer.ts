import { createReducer, on } from '@ngrx/store';
import { IArtist } from '../../interfaces/artist';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as ActionArtist from '../action/artist.action';


export interface ArtistState  extends EntityState<IArtist> {
    //loadAlbumsSuccess: boolean   //en cours de chargement ou pas
    artists: IArtist[];
    filteredArtists: IArtist[];
    load: boolean;
}

export function selectUserId(a: IArtist): string {
  return a.id;
}

export function sortByTitle(a: IArtist,b: IArtist) : number {
    return a.artist.localeCompare(b.artist);
}


export const adapter: EntityAdapter<IArtist> = createEntityAdapter<IArtist>({
  selectId: selectUserId,
  sortComparer: sortByTitle,
});

export const initialState: ArtistState = adapter.getInitialState({
    artists: [],
    filteredArtists: [],
    load: false
  });

export const artistReducer = createReducer(
    initialState,
    //on(ActionAlbum.loadAlbums, (state) => ({ ...state })),
    on(ActionArtist.loadArtistsSuccess, (state, { artists }) => ({ ...state, artists, filteredArtists: artists })),
    on(ActionArtist.addArtist, (state, { artist }) => ({ ...state, artists: [...state.artists, artist], filteredArtists: [...state.artists, artist] })),
    on(ActionArtist.filterArtistsByName, (state, { name }) => ({
      ...state,
      filteredArtists: state.artists.filter(artist => artist.artist.toLowerCase().includes(name.toLowerCase()))
    })),
    on(ActionArtist.filterArtistsBySearchScore, state => ({
      ...state,
      filteredArtists: [...state.artists].sort((a, b) => b.searchScore - a.searchScore)
    })),
    on(ActionArtist.incrementArtistSearchScore, (state, { artistId }) => {
      const albums = state.artists.map(artist =>
        artist.id === artistId ? { ...artist, searchScore: artist.searchScore + 1 } : artist
      );
      return { ...state, albums };
    })
);

// Recupération
export const { selectAll,selectEntities } = adapter.getSelectors();


