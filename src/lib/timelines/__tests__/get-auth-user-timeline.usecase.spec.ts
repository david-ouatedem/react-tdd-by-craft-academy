import { createStore } from "@/lib/create-store";
import { describe, expect, test } from "vitest";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";

describe("feature: retrieving authenticated user's timeline", () => {
  test("example: Alice is authenticated and can see her timeline", async () => {
    //arrange(given)
    givenAuthenticatedUserIs("Alice");
    givenExistingTimeline({
      user: "Alice",
      messages: [
        {
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "january 1 2024",
        },
        {
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "january 3 2024",
        },
      ],
    });
    //act(when)
    await whenRetrievingAuthenticatedUserTimeline();
    //assert(then)
    thenTheReceivedTimeLineShouldBe({
      user: "Alice",
      messages: [
        {
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "january 1 2024",
        },
        {
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
  user: string;
  messages: {
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

function thenTheReceivedTimeLineShouldBe(expectedTimeline: {
  user: string;
  messages: {
    text: string;
    author: string;
    publishedAt: string;
  }[];
}) {
  const authUserTimeline = store.getState();
  expect(authUserTimeline).toEqual(expectedTimeline);
}
