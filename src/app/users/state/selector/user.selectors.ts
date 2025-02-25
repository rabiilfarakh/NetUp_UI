import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducer/user.reducer';

export const  selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
    selectUserState,
    (state)=> state.user
)


export const selectError = createSelector(
    selectUserState,
    (state)=> state.error
)

export const selectSuccess= createSelector(
    selectUserState,
    (state)=> state.success
)

export const selectLoading = createSelector(
    selectUserState,
    (state)=> state.loading
)