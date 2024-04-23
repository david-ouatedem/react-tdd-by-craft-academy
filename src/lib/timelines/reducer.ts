import { combineReducers } from "@reduxjs/toolkit";
import { timelinesSlice } from "./slices/timelines.slice";
import { messagesSlices } from "./slices/messages.slice";

export const reducer = combineReducers({
  [timelinesSlice.name]: timelinesSlice.reducer,
  [messagesSlices.name]: messagesSlices.reducer,
});
