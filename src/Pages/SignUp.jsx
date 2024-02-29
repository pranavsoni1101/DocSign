import React, { useState } from 'react';
import { Container, Heading, Box, FormLabel, Input, Button, useToast, FormControl, Text, FormHelperText } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    const handleSignUp = async (event) => {
        event.preventDefault();
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
            if (!validatePassword(password)) {
                toastError("Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number");
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
            if (err.response && err.response.status === 409) {
                // Handle conflict error (email already exists)
                toastInfo("Email address already exists. Please login instead.");
                navigate("/login");
            } else {
                // Handle other errors
                toastError("An error occurred while creating your account");
                console.error("Oops signup error", err);
            }
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
        const re =/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        // const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    const validatePassword = (password) => {
        // Password validation using regex
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
        return re.test(password);
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

    const toastInfo = (message) => {
        toast({
            position: "top",
            variant: "left-accent",
            title: "info",
            description: message,
            status: "info",
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

    return (
        <>
            <Container maxW={"100%"}>
                <Heading mt="1em" textAlign="center">
                    Sign Up
                </Heading>
                <Text m="0 auto" mt="0.5em" w="md" textAlign="center">
                    Ready to ditch the pen and paper? Let's turn those scribbles into stylish digital signatures! Sign up
                    now and join the paperless revolution.
                </Text>
                <Box m="0 auto" mt="1em" w="lg" p="2em" boxShadow="2xl" borderRadius="xl" backgroundColor="gray.500">
                    <form onSubmit={handleSignUp}>
                        <FormControl isRequired mb="1em">
                            <FormLabel color="primary.500">Name</FormLabel>
                            <Input
                                color="#fff"
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Some One"
                                _hover={{ borderColor: "primary.500" }}
                                _placeholder={{
                                    color: "gray.200"
                                }}
                                focusBorderColor="primary.500"
                            />
                        </FormControl>
                        <FormControl isRequired mb="1em">
                            <FormLabel color="primary.500">Email</FormLabel>
                            <Input
                                color="#fff"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="someone@email.com"
                                _hover={{ borderColor: "primary.500" }}
                                _placeholder={{
                                    color: "gray.200"
                                }}
                                focusBorderColor="primary.500"
                            />
                        </FormControl>
                        <FormControl mb="1em" isRequired>
                            <FormLabel color="primary.500">Password</FormLabel>
                            <Input
                                color="#fff"
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Type Your password"
                                _hover={{ borderColor: "primary.500" }}
                                _placeholder={{
                                    color: "gray.200"
                                }}
                                focusBorderColor="primary.500"
                            />
                            <FormHelperText
                                color= "gray.200"
                            >The password must consist atleast 1 uppercase, 1 lowercase, 1 number and 1 special character</FormHelperText>
                        </FormControl>
                        <Button w="100%" type="submit" colorScheme="green">
                            Sign Up
                        </Button>
                    </form>
                </Box>
            </Container>
        </>
    )
}

export default SignUp;
