import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, UserRequest } from '../../model/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'User Register': props<{ request: UserRequest }>(),
    'User Register Success': props<{ data: User }>(),
    'User Register Failure': props<{ error: string }>(),
  }
});
