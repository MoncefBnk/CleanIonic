import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { loadLastPlayed, loadLastPlayedSuccess } from '../action/user.action';
import { UserService } from '../../services/user.service';

@Injectable()
export class UserEffects {
    loadSongs$ = createEffect(() =>
   this.actions$.pipe(
      ofType(loadLastPlayed),
      mergeMap((action ) =>
        this.userService.getUserLastPlayedWithSongDetails(action.userId,5).pipe(
          map(lastPlayeds => loadLastPlayedSuccess({ lastPlayeds: lastPlayeds || []  })),
          catchError(() => of({ type: '[User] Load last played Failure' }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}