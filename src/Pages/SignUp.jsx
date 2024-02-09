import React, { useState } from 'react';
import { Container, Heading, Box, 
        InputGroup, FormLabel, Input, 
        Button, 
        useToast} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const toast = useToast();

    const handleSignUp = async () => {
        try {
                const response = await axios.post("http://localhost:3001/auth/signup", {
                    name, 
                    email,
                    password
                });

                toast({
                    position: "top",
                    variant: "left-accent",
                    title: "We've Created Your Account!",
                    description: "Login to access the dashboard",
                    status: "success",
                    duration: 9000,
                    isClosable: true
                });
                // console.log("Successfully signed up");
                navigate("/login")
            }
        catch (err) {
            toast({
                position: "top",
                variant: "left-accent",
                title: "Could Not Your Account!",
                description: "An Error occured while creating your account",
                status: "error",
                duration: 9000,
                isClosable: true
            });
            console.log("Oops login error", error);
        }
    }
    
    const handleNameChange = (event) => {
        setName(event.target.value)
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
                        <FormLabel>Name</FormLabel>
                        <Input 
                            type='text'
                            value={name}
                            onChange={handleNameChange}
                            placeholder='Some One'
                        />
                    </InputGroup>
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
                        onClick={handleSignUp}
                    >
                        Sign In
                    </Button>
                </Box>
            </Container>
        </>
    )
}

export default SignUp;