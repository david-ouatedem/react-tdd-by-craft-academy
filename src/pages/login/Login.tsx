import {Button, Container, Heading, Stack, Text} from "@chakra-ui/react";
import {GitHubIcon, GoogleIcon} from "@/components/ProviderIcons.tsx";
import {useDispatch, useSelector} from "react-redux";
import {selectIsUserAuthenticated} from "@/lib/auth/reducer.ts";
import {useEffect, useState} from "react";
import {AppDispatch} from "@/lib/create-store.ts";
import {useNavigate} from "react-router-dom";
import {authenticateWithGoogle} from "@/lib/auth/usecases/authenticate-with-google.usecase.ts";

export const Login = () => {
    const isUserAuthenticated = useSelector(selectIsUserAuthenticated);
    const [authenticating, setAuthenticating] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const authWithGoogle = () => {
        setAuthenticating(true)
        dispatch(authenticateWithGoogle()).unwrap().finally(()=> setAuthenticating(false))
    }

    useEffect(() => {
        if(isUserAuthenticated){
            navigate("/")
        }
    }, [isUserAuthenticated, navigate]);

    if (isUserAuthenticated) return null

    return (
        <Container maxW="md" py={{base: "12", md: "24"}}>
            <Stack spacing="8">
                <Stack spacing="6">
                    <Stack spacing={{base: "2", md: "3"}} textAlign="center">
                        <Heading size={{base: "xs", md: "sm"}}>
                            Log in to your account
                        </Heading>
                        <Text color="muted">Crafty</Text>
                    </Stack>
                </Stack>
                <Stack spacing="6">
                    <Stack spacing="3">
                        <Button
                            variant="secondary"
                            leftIcon={<GoogleIcon boxSize="5"/>}
                            iconSpacing="3"
                            onClick={authWithGoogle}
                            isLoading={authenticating}
                        >
                            Continue with Google
                        </Button>
                        <Button
                            variant="secondary"
                            leftIcon={<GitHubIcon boxSize="5"/>}
                            iconSpacing="3"
                        >
                            Continue with GitHub
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
};