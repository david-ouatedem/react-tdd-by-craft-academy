import {AppStore, createStore} from "@/lib/create-store";
import { describe, expect, test } from "vitest";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";
import {selectIsUserTimelineLoading} from "../slices/timelines.slice";
import {stateBuilder} from "@/lib/state-builder.ts";

describe("feature: retrieving authenticated user's timeline", () => {
  test("example: Alice is authenticated and can see her timeline", async () => {
    //arrange(given)
    givenAuthenticatedUserIs("Alice");
    givenExistingTimeline({
      id: "alice-timeline-id",
      user: "Alice",
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "january 1 2024",
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "january 3 2024",
        },
      ],
    });
    //act(when)
    const timelineRetrieving = whenRetrievingAuthenticatedUserTimeline();
    //assert(then)
    thenTheTimelineOfUserShouldBeLoading("Alice");
    await timelineRetrieving;
    thenTheReceivedTimeLineShouldBe({
      id: "alice-timeline-id",
      user: "Alice",
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "january 1 2024",
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "january 3 2024",
        },
      ],
    });
  });
});

const timelineGateway = new FakeTimelineGateway();
const authGateway = new FakeAuthGateway();
let testStateBuilder = stateBuilder()
let store: AppStore;

function givenAuthenticatedUserIs(user: string) {
  testStateBuilder = testStateBuilder.withAuthUser({authUser: user})
}

function givenExistingTimeline(timeline: {
  id: string;
  user: string;
  messages: {
    id: string;
    text: string;
    author: string;
    publishedAt: string;
  }[];
}) {
  timelineGateway.timelineByUser.set(timeline.user, timeline);
}

async function whenRetrievingAuthenticatedUserTimeline() {
  store = createStore({
    authGateway,
    timelineGateway
  }, testStateBuilder.build())
  await store.dispatch(getAuthUserTimeline());
}

function thenTheTimelineOfUserShouldBeLoading(user: string){
  const isUserTimelineLoading = selectIsUserTimelineLoading(user, store.getState())
  expect(isUserTimelineLoading).toBe(true)
}

function thenTheReceivedTimeLineShouldBe(expectedTimeline: {
  id: string;
  user: string;
  messages: {
    id: string;
    text: string;
    author: string;
    publishedAt: string;
  }[];
}) {
  const expectedState = stateBuilder()
      .withAuthUser({authUser: expectedTimeline.user})
      .withTimeline({
    id: expectedTimeline.id,
    user: expectedTimeline.user,
    messages: expectedTimeline.messages.map(m=>m.id)
  }).withMessages(expectedTimeline.messages)
      .withNotLoadingTimelineOf({user: expectedTimeline.user}).build()
  expect(store.getState()).toEqual(expectedState)
}
