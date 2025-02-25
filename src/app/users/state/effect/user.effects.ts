import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../service/user.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { UserActions } from '../action/user.actions';



@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);


  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.userRegister), 
      mergeMap((action) =>
        this.userService.save(action.request).pipe(
          map((user) => UserActions.userRegisterSuccess({ data:user })), 
          catchError((error) => of(UserActions.userRegisterFailure({ error: error.message })))
        )
      )
    )
  );
}
