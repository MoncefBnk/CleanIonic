import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { FirestoreService } from '../../services/firestore.service';
import { filterSongsByTitle, incrementSongSearchScore, loadSongs, loadSongsSuccess } from '../action/song.action';
import { Store, select } from '@ngrx/store';
import { selectAllSongs } from '../selector/song.selector';
import { ISong } from '../../interfaces/song';

@Injectable()
export class SongEffects {
    loadSongs$ = createEffect(() =>
   this.actions$.pipe(
      ofType(loadSongs),
      mergeMap(() =>
        this.firestoreService.getAllSongsWithDetails().pipe(
          map(songs => loadSongsSuccess({ songs })),
          catchError(() => of({ type: '[Song] Load Albums Failure' }))
        )
      )
    )
  );

  filterSongsByTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSongsByTitle),
      withLatestFrom(this.store.pipe(select(selectAllSongs))),
      switchMap(([action, songs]) => {
        const filteredSongs: ISong[] = songs.filter(song =>
          song.title.toLowerCase().includes(action.title.toLowerCase())
        );
        const incrementActions = filteredSongs.map(song =>
          incrementSongSearchScore({ songId: song.id })
        );

        // Return the actions as an observable of Action[]
        return of(...incrementActions);
      })
    )
  );

  incrementSearchScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(incrementSongSearchScore),
      mergeMap(({ songId }) => {
        return this.firestoreService.updateSongScore(songId).then(
          () => ({ type: '[Song] Increment Search Score Success' }),
          (error) => ({ type: '[Song] Increment Search Score Failure', error })
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