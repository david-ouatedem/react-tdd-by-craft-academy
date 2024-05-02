import { createAppAsyncThunk } from "@/lib/create-app-thunk";
import {createAction} from "@reduxjs/toolkit";
import {selectAuthUser} from "@/lib/auth/reducer.ts";


export const getAuthUserTimelinePending = createAction<{authUser: string}>("timelines/getAuthUserTimelinePending")
export const getAuthUserTimeline = createAppAsyncThunk(
  "timelines/get-auth-user-timeline",
  async (_,{extra: { timelineGateway},dispatch, getState}) => {
    const authUser = selectAuthUser(getState());
    dispatch(getAuthUserTimelinePending({authUser: authUser}))
    const { timeline } = await timelineGateway.getUserTimeline({
      userId: authUser,
    });
    return timeline;
  }
);
