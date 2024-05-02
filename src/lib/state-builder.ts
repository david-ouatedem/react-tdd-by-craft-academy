import {Timeline, timelinesAdapter} from "@/lib/timelines/model/timeline-entity.ts";
import {RootState} from "@/lib/create-store.ts";
import {rootReducer} from "@/lib/root-reducer.ts";
import {ActionCreatorWithPayload, createAction, createReducer} from "@reduxjs/toolkit";
import {Message, messagesAdapter} from "@/lib/timelines/model/message.entity.ts";

const initialState = rootReducer(undefined, createAction("")())

const withAuthUser = createAction<{authUser: string}>("withAuthUser")
const withTimeline = createAction<Timeline>("withTimeline")
const withLoadingTimelineOf = createAction<{ user: string }>("withLoadingTimelineOf")
const withNotLoadingTimelineOf = createAction<{ user: string }>("withNotLoadingTimelineOf")
const withMessages = createAction<Message[]>("withMessages")

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(withAuthUser, (state, action) => {
        state.auth.authUser = action.payload.authUser
    })
    .addCase(withTimeline, (state, action) => {
        timelinesAdapter.addOne(state.timelines.timelines, action.payload)
    })
    .addCase(withLoadingTimelineOf, (state, action) => {
        state.timelines.timelines.loadingTimelineByUser[action.payload.user] = true
    })
    .addCase(withNotLoadingTimelineOf, (state, action) => {
        state.timelines.timelines.loadingTimelineByUser[action.payload.user] = false
    })
    .addCase(withMessages, (state, action) => {
        messagesAdapter.addMany(state.timelines.messages, action.payload)
    })
})
export const stateBuilder = (baseState = initialState) => {

    const reduce = <P>(actionCreator: ActionCreatorWithPayload<P>) =>
        (payload: P) => stateBuilder(reducer(baseState, actionCreator(payload)))

    return {
        withAuthUser: reduce(withAuthUser),
        withTimeline: reduce(withTimeline),
        withLoadingTimelineOf: reduce(withLoadingTimelineOf),
        withMessages: reduce(withMessages),
        withNotLoadingTimelineOf: reduce(withNotLoadingTimelineOf),
        build(): RootState {
            return baseState
        }
    }
}