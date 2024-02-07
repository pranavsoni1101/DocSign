import { Box, Container, FormControl, Heading, Input, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Envelope = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // const [recipients, setRecipients] = useState([])

    useEffect(()=> {
        const token = sessionStorage.getItem('token');
        if(!token)
            navigate("/login");
    },[])

    const handleNameChange = (event) => {
        setName(event.target.value);
    }
    
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    return(
        <>
            <Container
                maxW="100%"
            >
                <Heading>This is envelope</Heading>
                <Box
                    p = "2em"
                    boxSize = "xs"
                    boxShadow= "2xl"
                    borderRadius= "md"
                >
                    <Button>Upload Pdf</Button>
                </Box>
                <Box
                    p = "2em"
                    w = "sm"
                    boxShadow= "xl"

                >
                    <Heading
                        size= "sm"
                        as = "h3"
                    >
                        Add Recipient's Details</Heading>
                    <FormControl
                        mt = "1em"
                    >
                        <Input
                            mt = "1em" 
                            type='text'
                            value={name}
                            onChange={handleNameChange}
                            placeholder='John Doe'
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            mt = "1em" 
                            type='email'
                            value={email}
                            onChange={handleEmailChange}
                            placeholder='johndoe@something.com'
                        />
                    </FormControl>
                        <Button
                            mt = "1em"
                            // colorScheme=''
                        >
                            Add Recipient
                        </Button>
                </Box>
            </Container>
            
        </>
    )
}

export default Envelope;