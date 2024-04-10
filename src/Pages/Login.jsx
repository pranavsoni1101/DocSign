import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { Container, Heading, Box, 
         FormLabel, Input, Button, 
         useToast,
         FormControl, Text, Stack, FormErrorMessage
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';


const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const Login = () => {

    const toast = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const [isEmailError, setIsEmailError] = useState(false);
    const [isPasswordError, setIsPasswordError] = useState(false);


    const handleLogin = async (event) => {
        setIsSubmitLoading(true);
        event.preventDefault();
        try {
            // Perform form validations
            if (!validateEmail(email)) {
                setIsSubmitLoading(false);
                toastError("Invalid email address");
                return;
            }
            if (!password.trim()) {
                setIsSubmitLoading(false);
                toastError("Password is required");
                return;
            }

            const response = await axios.post(`${DOMAIN_NAME}/auth/login`, {
                email,
                password
            });
            const data = response.data;
            Cookies.set("jwt", data.token)
            sessionStorage.setItem('token', data.token);
            toastSuccess("You have Logged In!");
            navigate("/profile");
        } catch (err) {
            setIsSubmitLoading(false);
            if (err.response && err.response.status === 404) {
                setIsEmailError(true);
                toastError("User does not exist");
            } else if (err.response && err.response.status === 401) {
                setIsPasswordError(true)
                toastError("Invalid email or password");
            } else {
                toastError("An error occurred while trying to log you in");
                console.error("Oops login error", err);
            }
        }
    }
    
    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const validateEmail = (email) => {
        // Basic email validation using regex
        const re =/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return re.test(email);
    }

    const toastSuccess = (message) => {
        toast({
            position: "top",
            variant: "left-accent",
            title: "Success",
            description: message,
            status: "success",
            duration: 9000,
            isClosable: true
        });
    }

    const toastError = (message) => {
        toast({
            position: "top",
            variant: "left-accent",
            title: "Error",
            description: message,
            status: "error",
            duration: 9000,
            isClosable: true
        });
    }

    return(
        <>
            <Container
                maxW={"100%"}
                minH = {"100vh"}
            >
                <Heading
                    mt = "1em"
                    textAlign="center"
                >
                    Login
                </Heading>
                <Text
                    m = "0 auto"
                    mt = "0.5em"
                    // w = "md"
                    textAlign= "center" 
                >
                    Time to unlock the digital vault! Dive into your signed wonders by logging in now.
                </Text>
                <Stack
                    m = "0 auto"
                    mt = "1em"
                    maxW = "lg"
                    p = "2em"
                    boxShadow= "2xl"
                    borderRadius= "xl"
                    backgroundColor= 'gray.500'
                >
                    <form onSubmit={handleLogin}>
                        <FormControl mb="1em" isRequired isInvalid={isEmailError}>
                            <FormLabel
                                color= "primary.500"
                            >
                                Email
                            </FormLabel>
                            <Input 
                                color= "white"
                                type='email'
                                value={email}
                                onChange={handleEmailChange}
                                placeholder='someone@email.com'
                                _hover = {{
                                    borderColor: "primary.500"
                                }}
                                focusBorderColor='primary.500'
                            />
                           <FormErrorMessage>Email entered does not exist</FormErrorMessage>
                        </FormControl>
                        <FormControl mb="1em" isRequired isInvalid= {isPasswordError}>
                            <FormLabel
                                color= "primary.500"
                            >
                                Password
                            </FormLabel>
                            <Input 
                                color= "white"
                                type='password'
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder='Type Your password'
                                _hover = {{
                                    borderColor: "primary.500"
                                }}
                                // focusBorderColor='primary.500'
                            />
                           { isPasswordError && <FormErrorMessage>Password entered is incorrect</FormErrorMessage>}
                        </FormControl>
                        <Button
                            w = "100%"
                            colorScheme = "green"
                            // onClick={handleLogin}
                            isLoading = {isSubmitLoading}
                            type = "submit"
                        >
                            Sign In
                        </Button>
                    </form>
                    <Text 
                        color= "gray.100"
                        textAlign= "center"
                    >
                        Do not have an account with us?&nbsp;
                        <span>
                            <Link
                                to={"/signup"}
                                style={{color: "#FFB738", textDecoration: "underline"}}
                            >  
                                Sign Up
                            </Link>
                        </span>
                    </Text>
                </Stack>
            </Container>
            <Footer />
        </>
    )
}

export default Login;
