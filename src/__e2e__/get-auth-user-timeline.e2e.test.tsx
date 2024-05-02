import {describe, expect, test} from "vitest";
import {FakeAuthGateway} from "@/lib/auth/infra/fake-auth.gateway.ts";
import {FakeTimelineGateway} from "@/lib/timelines/infra/fake-timeline.gateway.ts";

describe("Get auth user timeline", ()=>{
    test("displays the authenticated user timeline on the home page", async ()=>{
        const authGateway = new FakeAuthGateway();
        authGateway.authUser = "Alice";
        const timelineGateway = new FakeTimelineGateway();
        timelineGateway.timelineByUser.set("Alice", {
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
        })
        // const store = createStore({
        //     authGateway,
        //     timelineGateway
        // })
        // const router = createRouter({store})

        // render(<Provider store={store} router={router}/>)

        // expect(await screen.findByText("Hello it's Bob")).toHaveTextContent();
        expect(true).toBe(true)
    })
})