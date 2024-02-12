import React, { useState } from 'react';
import { Container, Heading, Box, 
         FormLabel, Input, Button, 
         useToast,
         FormControl
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async () => {
        try {
            // Perform form validations
            if (!validateEmail(email)) {
                toastError("Invalid email address");
                return;
            }
            if (!password.trim()) {
                toastError("Password is required");
                return;
            }

            const response = await axios.post("http://localhost:3001/auth/login", {
                email,
                password
            });
            const data = response.data;
            sessionStorage.setItem('token', data.token);
            toastSuccess("You have Logged In!");
            navigate("/dashboard");
        } catch (err) {
            if (err.response && err.response.status === 404) {
                toastError("User does not exist");
            } else if (err.response && err.response.status === 401) {
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
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
            >
                <Heading
                    my = "1em"
                    textAlign="center"
                >
                    This is login
                </Heading>
                <Box
                    m = "0 auto"
                    w = "xl"
                    p = "1em"
                    boxShadow= "2xl"
                    borderRadius= "xl"
                >
                    <FormControl mb="1em" isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input 
                            type='email'
                            value={email}
                            onChange={handleEmailChange}
                            placeholder='someone@email.com'
                        />
                    </FormControl>
                    <FormControl mb="1em" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input 
                            type='password'
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder='Type Your password'
                        />
                    </FormControl>
                    <Button
                        w = "100%"
                        colorScheme = "green"
                        onClick={handleLogin}
                    >
                        Sign In
                    </Button>
                </Box>
            </Container>
        </>
    )
}

export default Login;
