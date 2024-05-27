import {
    Button,
    Checkbox,
    Flex,
    Text,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Image,
    useToast,
    useDisclosure
  } from '@chakra-ui/react';
  import axios from 'axios';
  import Cookies from 'js-cookie';
  import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
import ErrorToast from '../../components/Toasts/ErrorToast';
import SuccessToast from '../../components/Toasts/SuccessToast';
import { FcGoogle } from "react-icons/fc";
import ForgotPassGetMail from '../../components/ModalsPopover/ForgotPassGetMailModal';

//   import Footer from '../../components/Footer';
  const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;
  const Login = () => {

    const toast = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const [isEmailError, setIsEmailError] = useState(false);
    const [isPasswordError, setIsPasswordError] = useState(false);

    const {isOpen, onOpen, onClose} = useDisclosure()

    const handleLogin = async (event) => {
        setIsSubmitLoading(true);
        event.preventDefault();
        try {
            // Perform form validations
            if (!validateEmail(email)) {
                setIsSubmitLoading(false);
                ErrorToast("Error","Invalid email address");
                return;
            }
            if (!password.trim()) {
                setIsSubmitLoading(false);
                ErrorToast("Error","Password is required");
                return;
            }

            const response = await axios.post(`${DOMAIN_NAME}/auth/login`, {
                email,
                password
            });
            const data = response.data;
            Cookies.set("jwt", data.token)
            sessionStorage.setItem('token', data.token);
            SuccessToast("Success","You have Logged In!");
            navigate("/profile");
        } catch (err) {
            setIsSubmitLoading(false);
            if (err.response && err.response.status === 404) {
                setIsEmailError(true);
                ErrorToast("Error","User does not exist");
            } else if (err.response && err.response.status === 401) {
                setIsPasswordError(true)
                ErrorToast("Error","Invalid email or password");
            } else {
                ErrorToast("Error","An error occurred while trying to log you in");
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

    return (
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Stack spacing={4} w={'full'} maxW={'md'}>
            <Heading fontSize={'2xl'}>Sign in to your account</Heading>
            <form onSubmit={handleLogin}>
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
                </FormControl>
                <Stack spacing={6}>
                <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}
                    mt = "10px"
                    >
                    <Text>
                        Do not have an account? 
                        <Link to={"/signup"} style={{color: "#3182CE"}}> Sign Up</Link>
                    </Text>
                    <Button 
                        color={'blue.500'} 
                        variant='link' 
                        fontWeight= "normal"
                        onClick={onOpen}
                    >
                        Forgot password?
                    </Button>
                    <ForgotPassGetMail open = {isOpen} close = {onClose}/>
                </Stack>
                <Button 
                    type='submit'
                    isLoading={isSubmitLoading}
                    colorScheme={'blue'} 
                    variant={'solid'}
                >
                    Sign in
                </Button>
                <Text 
                    textAlign= "center"
                    fontWeight= "bold"
                >
                    OR
                </Text>
                <Button
                    fontSize="xl"
                >
                    <FcGoogle />
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
              'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
            }
          />
        </Flex>
      </Stack>
    )
  }
  
  export default Login;