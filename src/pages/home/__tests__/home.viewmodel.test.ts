import { createTestStore } from "@/lib/create-store";
import { describe, expect, test } from "vitest";
import { HomeViewModelType, selectHomeViewModel } from "../home.viewmodel";

const getNow = () => "2024-05-17T11:30:00.000Z";

describe("home view model", () => {
  test("example: there is no timeline in the store", () => {
    const store = createTestStore();

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.NoTimeline,
      },
    });
  });

  test("example: there is no message in the timeline", () => {
    const store = createTestStore(
      {},
      {
        timelines: {
          ids: ["alice-timeline-id"],
          entities: {
            "alice-timeline-id": {
              id: "alice-timeline-id",
              messages: [],
              user: "Alice",
            },
          },
          loadingTimelineByUser: {}
        },
      }
    );

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.EmptyTimeline,
        info: "There is no message yet",
      },
    });
  });

  test("example: the timeline is loading", () => {
    const store = createTestStore(
        {},
        {
          timelines: {
            ids: [],
            entities: {},
            loadingTimelineByUser: {
              Alice: true
            }
          },
        }
    );

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.LoadingTimeline,
        info: "Loading...",
      },
    });
  });

  test("example: there is one message in the timeline", () => {
    const store = createTestStore(
      {},
      {
        timelines: {
          ids: ["alice-timeline-id"],
          entities: {
            "alice-timeline-id": {
              id: "alice-timeline-id",
              messages: ["msg1-id"],
              user: "Alice",
            },
          },
          loadingTimelineByUser: {}
        },
        messages: {
          ids: ["msg1-id"],
          entities: {
            "msg1-id": {
              id: "msg1-id",
              author: "Bob",
              publishedAt: "2024-05-17T11:00:00.000Z",
              text: "hello world, I'm Bob",
            },
          },
        },
      }
    );

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.WithMessages,
        messages: [
          {
            id: "msg1-id",
            userId: "Bob",
            username: "Bob",
            profilePictureUrl: "https://picsum.photos/200?random=Bob",
            publishedAt: "30 minutes ago",
            text: "hello world, I'm Bob",
          },
        ],
      },
    });
  });

  test("example: there are many messages in the timeline", () => {
    const store = createTestStore(
      {},
      {
        timelines: {
          ids: ["alice-timeline-id"],
          entities: {
            "alice-timeline-id": {
              id: "alice-timeline-id",
              messages: ["msg1-id", "msg2-id"],
              user: "Alice",
            },
          },
          loadingTimelineByUser: {}
        },
        messages: {
          ids: ["msg1-id", "msg2-id"],
          entities: {
            "msg1-id": {
              id: "msg1-id",
              author: "Bob",
              publishedAt: "2024-05-17T11:10:00.000Z",
              text: "hello world, I'm Bob",
            },
            "msg2-id": {
              id: "msg2-id",
              author: "Alice",
              publishedAt: "2024-05-17T11:15:00.000Z",
              text: "hello world, I'm Alice",
            },
          },
        },
      }
    );

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.WithMessages,
        messages: [
          {
            id: "msg1-id",
            userId: "Bob",
            username: "Bob",
            profilePictureUrl: "https://picsum.photos/200?random=Bob",
            publishedAt: "20 minutes ago",
            text: "hello world, I'm Bob",
          },
          {
            id: "msg2-id",
            userId: "Alice",
            username: "Alice",
            profilePictureUrl: "https://picsum.photos/200?random=Alice",
            publishedAt: "15 minutes ago",
            text: "hello world, I'm Alice",
          },
        ],
      },
    });
  });
});
