import React, { useState } from 'react';
import { Container, Heading, Box, 
        InputGroup, FormLabel, Input, 
        Button, 
        useToast} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async () => {
        try {
                const response = await axios.post("http://localhost:3001/auth/login", {
                    email,
                    password
                });
                const data = response.data;
                sessionStorage.setItem('token', data.token);
                toast({
                    position: "top",
                    variant: "left-accent",
                    title: "You have Logged In!",
                    description: "Feel free to Explore",
                    status: "success",
                    duration: 9000,
                    isClosable: true
                });
                navigate("/dashboard");
            }
        catch (err) {
            toast({
                position: "top",
                variant: "left-accent",
                title: "Could Not Log You In",
                description: "An Error occured while trying to log you in",
                status: "error",
                duration: 9000,
                isClosable: true
            });
            console.log("Oops login error", err);
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
                    This is login
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

export default Login;