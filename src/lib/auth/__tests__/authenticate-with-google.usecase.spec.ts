import {describe, expect, test} from "vitest";
import {stateBuilder} from "@/lib/state-builder.ts";
import {createTestStore} from "@/lib/create-store.ts";
import {authenticateWithGoogle} from "@/lib/auth/usecases/authenticate-with-google.usecase.ts";
import {FakeAuthGateway} from "@/lib/auth/infra/fake-auth.gateway.ts";

describe("Feature: Authenticating with Google", () => {
    test("Example: Alice authenticates with google successfully", async () => {
        givenAuthenticationWithUserWillSucceedForUser("Alice")

        await whenUserAutheticatesWithGoogle()

        theUserShouldBeAuthenticated({authUser: "Alice"})
    })
})

const authGateway = new FakeAuthGateway()

const store = createTestStore({
    authGateway
})

function givenAuthenticationWithUserWillSucceedForUser(authUser: string) {
    authGateway.willSucceedForGoogleAuthForUser = authUser
}

async function whenUserAutheticatesWithGoogle() {
    return store.dispatch(authenticateWithGoogle())
}

function theUserShouldBeAuthenticated({authUser}: {authUser: string}) {
    const expectedState = stateBuilder().withAuthUser({authUser}).build()
    expect(store.getState()).toEqual(expectedState)
}