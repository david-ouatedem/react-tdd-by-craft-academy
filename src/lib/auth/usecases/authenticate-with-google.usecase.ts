import {createAppAsyncThunk} from "@/lib/create-app-thunk.ts";

export const authenticateWithGoogle = createAppAsyncThunk(
    "auth/authenticate-with-google",
    async (_,{extra:{authGateway}}) => {
        const authUser = await authGateway.authenticateWithGoogle()

        return authUser
    }
)