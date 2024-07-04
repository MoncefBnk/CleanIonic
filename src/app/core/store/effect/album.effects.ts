import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { FirestoreService } from '../../services/firestore.service';

import { filterAlbumsByTitle, incrementAlbumSearchScore, loadAlbums, loadAlbumsSuccess } from '../action/album.action';
import { selectAllAlbums } from '../selector/album.selector';
import { IAlbum } from '../../interfaces/album';

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

  filterAlbumsByTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterAlbumsByTitle),
      withLatestFrom(this.store.pipe(select(selectAllAlbums))),
      switchMap(([action, albums]) => {
        const filteredAlbums: IAlbum[] = albums.filter(album =>
          album.title.toLowerCase().includes(action.title.toLowerCase())
        );
        const incrementActions = filteredAlbums.map(album =>
          incrementAlbumSearchScore({ albumId: album.id })
        );

        // Return the actions as an observable of Action[]
        return of(...incrementActions);
      })
    )
  );

  incrementSearchScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(incrementAlbumSearchScore),
      mergeMap(({ albumId }) => {
        return this.firestoreService.updateAlbumScore(albumId).then(
          () => ({ type: '[Album] Increment Search Score Success' }),
          (error) => ({ type: '[Album] Increment Search Score Failure', error })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private store:Store
  ) {}
}