import {createSlice, EntityState} from "@reduxjs/toolkit";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";
import {Timeline, timelinesAdapter} from "../model/timeline-entity";
import { RootState } from "@/lib/create-store";

export  type TimelinesSliceState = EntityState<Timeline, string> & {
  loadingTimelineByUser: {[userId: string]: boolean}
}

export const timelinesSlice = createSlice({
  name: "timelines",
  initialState: timelinesAdapter.getInitialState({
    loadingTimelineByUser: {}
  }) as TimelinesSliceState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAuthUserTimeline.pending, (state) =>{
      state.loadingTimelineByUser["Alice"] = true
    })
    builder.addCase(getAuthUserTimeline.fulfilled, (state, action) => {
      const timeline = action.payload;
      timelinesAdapter.addOne(state, {
        id: timeline.id,
        user: timeline.user,
        messages: timeline.messages.map((m) => m.id),
      });
      state.loadingTimelineByUser["Alice"] = false
    });
  },
});

export const selectTimeline = (timelineId: string, state: RootState) =>
  timelinesAdapter.getSelectors().selectById(state.timelines, timelineId);

export const selectIsUserTimelineLoading = (user: string, state: RootState) => state.timelines.loadingTimelineByUser[user] ?? false;