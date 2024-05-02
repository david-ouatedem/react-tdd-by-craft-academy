import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "./Provider.tsx";
import { FakeAuthGateway } from "./lib/auth/infra/fake-auth.gateway.ts";
import { FakeTimelineGateway } from "./lib/timelines/infra/fake-timeline.gateway.ts";
import { createStore } from "./lib/create-store.ts";
import { createRouter } from "./router.tsx";

const authGateway = new FakeAuthGateway(500 );
authGateway.willSucceedForGoogleAuthForUser = "Alice"

const timelineGateway = new FakeTimelineGateway(1000);
timelineGateway.timelineByUser.set("Alice", {
  id: "alice-timeline-id",
  user: "Alice",
  messages: [
    {
      id: "msg1-id",
      text: "Hello it's Bob",
      author: "Bob",
      publishedAt: "2024-05-17T11:10:00.000Z",
    },
    {
      id: "msg2-id",
      text: "Hello it's Alice",
      author: "Alice",
      publishedAt: "2024-05-17T11:10:00.000Z",
    },
  ],
});

timelineGateway.timelineByUser.set("Bob", {
  id: "bob-timeline-id",
  user: "Bob",
  messages: [
    {
      id: "msg1-id",
      text: "Hello it's Bob",
      author: "Bob",
      publishedAt: "2024-05-17T11:10:00.000Z",
    },
    {
      id: "msg3-id",
      text: "older message on bob's timeline",
      author: "Charles",
      publishedAt: "2024-05-17T11:10:00.000Z",
    },
  ],
});

const store = createStore({
  authGateway,
  timelineGateway,
});

const router = createRouter({ store });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store} router={router} />
  </React.StrictMode>
);
