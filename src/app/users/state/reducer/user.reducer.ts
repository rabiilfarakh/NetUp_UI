import { createReducer, on } from '@ngrx/store';
import { User } from '../../model/user.model';
import { UserActions } from '../action/user.actions';
export const userFeatureKey = 'user';

export interface UserState {
user: User | null,
loading:boolean,
error: string | null,
success: string | null,
}

export const initialState: UserState = {
user : null,
loading: false,
error: null,
success: null

};

export const UserReducer = createReducer(
  initialState,
  on(UserActions.userRegister, (state) => ({
    ...state,
    loading: true, 
    error: null,
    success: null,
    user: null,
  })),

 // Handle successful registration
 on(UserActions.userRegisterSuccess, (state, { data: user }) => ({
  ...state,
  user: user,
  loading: false,
  success: "user register successfully",
  error: null
})),

// Handle registration failure
on(UserActions.userRegisterFailure, (state, { error }) => ({
  ...state,
  loading: false,
  user: null,
  success: null,
  error:error,
})));

