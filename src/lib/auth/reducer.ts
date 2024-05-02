import {createAction, createReducer} from "@reduxjs/toolkit";
import {RootState} from "@/lib/create-store.ts";
import {authenticateWithGoogle} from "@/lib/auth/usecases/authenticate-with-google.usecase.ts";

export type AuthState = {
    authUser?: string
}
export const userAthenticated = createAction<{ authUser: string }>("auth/userAuthenticated")
export const reducer = createReducer<AuthState>(
    {
        authUser: undefined
    },
    (builder) => {
        builder.addCase(userAthenticated, (state, action) => {
            state.authUser = action.payload.authUser
        })
        builder.addCase(authenticateWithGoogle.fulfilled, (state, action) => {
            state.authUser = action.payload
        })
    }
)

export const selectIsUserAuthenticated = (state: RootState) => state.auth.authUser !== undefined;

export const selectAuthUser = (state: RootState) => state.auth.authUser??""
