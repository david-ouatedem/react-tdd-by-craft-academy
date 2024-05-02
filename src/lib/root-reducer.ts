import {reducer as timelineReducer} from "@/lib/timelines/reducer.ts";
import {reducer as authReducer} from "@/lib/auth/reducer.ts";
import {combineReducers} from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    timelines: timelineReducer,
    auth: authReducer
});
