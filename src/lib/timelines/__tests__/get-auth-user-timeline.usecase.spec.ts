import { createStore } from "@/lib/create-store";
import { describe, expect, test } from "vitest";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";
import {selectIsUserTimelineLoading, selectTimeline} from "../slices/timelines.slice";
import { selectMessage } from "../slices/messages.slice";

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

const store = createStore({
  authGateway,
  timelineGateway,
});

function givenAuthenticatedUserIs(user: string) {
  authGateway.authUser = user;
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
  timelineGateway.timelineByUser.set("Alice", timeline);
}

async function whenRetrievingAuthenticatedUserTimeline() {
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
  const authUserTimeline = selectTimeline(
    expectedTimeline.id,
    store.getState()
  );
  expect(authUserTimeline).toEqual({
    id: expectedTimeline.id,
    user: expectedTimeline.user,
    messages: expectedTimeline.messages.map((m) => m.id),
  });
  expectedTimeline.messages.forEach((msg) => {
    expect(selectMessage(msg.id, store.getState())).toEqual(msg)
  });
  expect(selectIsUserTimelineLoading(expectedTimeline.user, store.getState())).toBe(false)
}
