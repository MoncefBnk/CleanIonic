import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../services/firestore.service';
import { loadSongs, loadSongsSuccess } from '../action/song.action';

@Injectable()
export class SongEffects {
    loadSongs$ = createEffect(() =>
   this.actions$.pipe(
      ofType(loadSongs),
      mergeMap(() =>
        this.firestoreService.getSongs().pipe(
          map(songs => loadSongsSuccess({ songs })),
          catchError(() => of({ type: '[Song] Load Albums Failure' }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService
  ) {}
}