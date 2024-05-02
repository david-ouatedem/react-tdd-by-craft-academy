import {AuthGateway, AuthUser} from "../model/auth.gateway";

export class FakeAuthGateway implements AuthGateway {
    willSucceedForGoogleAuthForUser!: string

    constructor(private readonly delay = 0) {
    }

    authenticateWithGoogle(): Promise<AuthUser> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.willSucceedForGoogleAuthForUser)
            }, this.delay)
        })
    }
}

export const authGateway = new FakeAuthGateway();
