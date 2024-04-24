import React, { useState } from 'react';
import { Container, Heading, Stack, FormLabel, Flex, Image,Input, Button, useToast, FormControl, Text, FormHelperText } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { Link  } from 'react-router-dom';

const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const handleSignUp = async (event) => {
        setIsSubmitLoading(true);
        event.preventDefault();
        try {
            // Perform form validations
            if (!name.trim()) {
                setIsSubmitLoading(false);
                toastError("Name is required");
                return;
            }
            if (!validateEmail(email)) {
                setIsSubmitLoading(false);
                toastError("Invalid email address");
                return;
            }
            if (!validatePassword(password)) {
                setIsSubmitLoading(false);
                toastError("Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number");
                return;
            }

            const response = await axios.post(`${DOMAIN_NAME}/auth/signup`, {
                name, 
                email,
                password
            });
            
            toastSuccess("Account created successfully");
            navigate("/login");
        } catch (err) {
            setIsSubmitLoading(false);
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
            <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
                <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Heading fontSize={'2xl'}>Create your account</Heading>
                    <form onSubmit={handleSignUp}>
                    <FormControl id="name">
                        <FormLabel>Name</FormLabel>
                        <Input 
                            type="name" 
                            value={name}
                            onChange={handleNameChange}
                            // placeholder='abc@gmail.com'
                        />
                        </FormControl>
                        <FormControl id="email">
                        <FormLabel>Email </FormLabel>
                        <Input 
                            type="email" 
                            value={email}
                            onChange={handleEmailChange}
                            // placeholder='abc@gmail.com'
                        />
                        </FormControl>
                        <FormControl id="password">
                        <FormLabel>
                            Password
                        </FormLabel>
                        <Input 
                            type="password" 
                            value={password}
                            onChange={handlePasswordChange}
                        />
                            <FormHelperText
                                color= "gray.400"
                            >
                                Password must have: 1 uppercase, 1 lowercase, 1 number, and 1 special character.
                            </FormHelperText>
                        </FormControl>
                        <Stack spacing={6}>
                        <Stack
                            direction={{ base: 'column', sm: 'row' }}
                            align={'start'}
                            justify={'space-between'}>
                            <Text>
                                Already have an account? 
                                <Link to={"/login"} style={{color: "#3182CE"}}> Log In</Link>
                            </Text>
                        </Stack>
                        <Button 
                            type='submit'
                            colorScheme={'blue'} 
                            variant={'solid'}
                        >
                            Sign in
                        </Button>
                        </Stack>
                    </form>
                </Stack>
                </Flex>
                <Flex flex={1}>
                <Image
                    alt={'Login Image'}
                    objectFit={'cover'}
                    src={
                    'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    }
                />
                </Flex>
            </Stack>
        </>
    )
}

export default SignUp;
