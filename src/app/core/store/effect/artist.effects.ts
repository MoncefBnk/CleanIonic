import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { filterArtistsByName, incrementArtistSearchScore, loadArtists, loadArtistsSuccess } from '../action/artist.action';
import { selectAllArtists } from '../selector/artist.selector';
import { IArtist } from '../../interfaces/artist';
import { Store, select } from '@ngrx/store';
import { ArtistService } from '../../services/artist.service';

@Injectable()
export class ArtistEffects {
   loadArtists$ = createEffect(() =>
   this.actions$.pipe(
      ofType(loadArtists),
      mergeMap(() =>
        this.artistService.getArtists().pipe(
          map(artists => loadArtistsSuccess({ artists })),
          catchError(() => of({ type: '[Artist] Load Artists Failure' }))
        )
      )
    )
  );

  filterArtistsByName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterArtistsByName),
      withLatestFrom(this.store.pipe(select(selectAllArtists))),
      switchMap(([action, artists]) => {
        const filteredArtists: IArtist[] = artists.filter(artist =>
          artist.artist.toLowerCase().includes(action.name.toLowerCase())
        );
        const incrementActions = filteredArtists.map(artist =>
          incrementArtistSearchScore({ artistId: artist.id })
        );

        // Return the actions as an observable of Action[]
        return of(...incrementActions);
      })
    )
  );

  incrementSearchScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(incrementArtistSearchScore),
      mergeMap(({ artistId }) => {
        return this.artistService.updateArtistScore(artistId).then(
          () => ({ type: '[Album] Increment Search Score Success' }),
          (error) => ({ type: '[Album] Increment Search Score Failure', error })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private artistService: ArtistService,
    private store:Store
  ) {}
}