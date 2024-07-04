import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../services/firestore.service';
import { loadArtists, loadArtistsSuccess } from '../action/artist.action';

@Injectable()
export class ArtistEffects {
   loadArtists$ = createEffect(() =>
   this.actions$.pipe(
      ofType(loadArtists),
      mergeMap(() =>
        this.firestoreService.getArtists().pipe(
          map(artists => loadArtistsSuccess({ artists })),
          catchError(() => of({ type: '[Artist] Load Artists Failure' }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService
  ) {}
}