import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../services/firestore.service';
import { loadAlbums, loadAlbumsSuccess } from '../action/album.action';

@Injectable()
export class AlbumEffects {
   loadAlbums$ = createEffect(() =>
   this.actions$.pipe(
      ofType(loadAlbums),
      mergeMap(() =>
        this.firestoreService.getAlbums().pipe(
          map(albums => loadAlbumsSuccess({ albums })),
          catchError(() => of({ type: '[Album] Load Albums Failure' }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService
  ) {}
}