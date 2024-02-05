import React, { useState } from 'react';
import { Container, Heading, Box, 
        InputGroup, FormLabel, Input, 
        Button } from '@chakra-ui/react';
import axios from 'axios';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
                const response = await axios.post("http://localhost:3001/auth/signup", {
                    email,
                    password
                });
                const data = response.data;
                sessionStorage.setItem('token', data.token);
                console.log("Successfully signed up");
            }
        catch (err) {
            console.log("Oops login error", error);
        }
    }
    
    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
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
                    This is Sign Up
                </Heading>
                <Box
                    m = "0 auto"
                    w = "xl"
                    p = "1em"
                    // bg= "cyan"
                    boxShadow= "2xl"
                    borderRadius= "xl"
                >
                    <InputGroup
                        mb = "1em"
                    >
                        <FormLabel>Email</FormLabel>
                        <Input 
                            type='email'
                            value={email}
                            onChange={handleEmailChange}
                            placeholder='someone@email.com'
                        />
                    </InputGroup>
                    <InputGroup
                        mb = "1em"
                    >
                        <FormLabel>Password</FormLabel>
                        <Input 
                            type='password'
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder='Type Your password'
                        />
                    </InputGroup>
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

export default SignUp;