import {Timeline, timelinesAdapter} from "@/lib/timelines/model/timeline-entity.ts";
import {RootState} from "@/lib/create-store.ts";
import {rootReducer} from "@/lib/root-reducer.ts";
import {ActionCreatorWithPayload, createAction, createReducer} from "@reduxjs/toolkit";
import {Message, messagesAdapter} from "@/lib/timelines/model/message.entity.ts";

const initialState = rootReducer(undefined, createAction("")())

const withTimeline = createAction<Timeline>("withTimeline")
const withLoadingTimelineOf = createAction<{ user: string }>("withLoadingTimelineOf")
const withNotLoadingTimelineOf = createAction<{ user: string }>("withNotLoadingTimelineOf")
const withMessages = createAction<Message[]>("withMessages")

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(withTimeline, (state, action) => {
        timelinesAdapter.addOne(state.timelines, action.payload)
    })
    builder.addCase(withLoadingTimelineOf, (state, action) => {
        state.timelines.loadingTimelineByUser[action.payload.user] = true
    })
    builder.addCase(withNotLoadingTimelineOf, (state, action) => {
        state.timelines.loadingTimelineByUser[action.payload.user] = false
    })
    builder.addCase(withMessages, (state, action) => {
        messagesAdapter.addMany(state.messages, action.payload)
    })
})
export const stateBuilder = (baseState = initialState) => {

    const reduce = <P>(actionCreator: ActionCreatorWithPayload<P>) =>
        (payload: P) => stateBuilder(reducer(baseState, actionCreator(payload)))

    return {
        withTimeline: reduce(withTimeline),
        withLoadingTimelineOf: reduce(withLoadingTimelineOf),
        withMessages: reduce(withMessages),
        withNotLoadingTimelineOf: reduce(withNotLoadingTimelineOf),
        build(): RootState {
            return baseState
        }
    }
}