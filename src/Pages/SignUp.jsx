import React, { useState } from 'react';
import { Container, Heading, Box, 
         FormLabel, Input, Button, 
        useToast, FormControl
} from '@chakra-ui/react';
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
            // Perform form validations
            if (!name.trim()) {
                toastError("Name is required");
                return;
            }
            if (!validateEmail(email)) {
                toastError("Invalid email address");
                return;
            }
            if (!password.trim()) {
                toastError("Password is required");
                return;
            }

            const response = await axios.post("http://localhost:3001/auth/signup", {
                name, 
                email,
                password
            });

            toastSuccess("Account created successfully");
            navigate("/login");
        } catch (err) {
            toastError("An error occurred while creating your account");
            console.error("Oops login error", error);
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
            duration: 5000,
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
            duration: 5000,
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
                    This is Sign Up
                </Heading>
                <Box
                    m = "0 auto"
                    w = "xl"
                    p = "1em"
                    boxShadow= "2xl"
                    borderRadius= "xl"
                >
                    <FormControl
                        isRequired
                        mb = "1em"
                    >
                        <FormLabel>Name</FormLabel>
                        <Input 
                            type='text'
                            value={name}
                            onChange={handleNameChange}
                            placeholder='Some One'
                        />
                    </FormControl>
                    <FormControl
                        isRequired
                        mb = "1em"
                    >
                        <FormLabel>Email</FormLabel>
                        <Input 
                            type='email'
                            value={email}
                            onChange={handleEmailChange}
                            placeholder='someone@email.com'
                        />
                    </FormControl>
                    <FormControl
                        mb = "1em"
                        isRequired
                    >
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
                        onClick={handleSignUp}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Container>
        </>
    )
}

export default SignUp;
