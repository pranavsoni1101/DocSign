import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Container, FormControl, 
         Heading, Input, Button, useToast } from '@chakra-ui/react';
import UploadPdfModal from '../../components/ModalsPopover/UploadPdfModal';
import fetchUserDetails from '../../utils/fetchUser';

const Envelope = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [inputPdfFile, setInputPdfFile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [usersLoading, setUsersLoading] = useState(true); 

    const toast = useToast();
    
    // Logic to redirect user if the token is not found in the sessionStorage
    useEffect(()=> {
        fetchUserDetails(navigate,setUser,setUsersLoading)
    },[])
    
    // Handle Name input change and store to state
    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    // Handle Email input change and store to state
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    
    // Handle File Input Change
    const handlePdfFileChange = (e) => {
        setInputPdfFile(e.target.files[0]);
    };

    // Handle PDF upload
    const handlePdfUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('pdf', inputPdfFile);

            // Make a POST request to upload the PDF file
            const response = await axios.post(`http://localhost:3001/pdf/${user.id}/pdfs`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer 65c0c3dfb849ea0136a63124' // Pass the user ID in the Authorization header
                }
            });
            toast({
                position: "top",
                variant: "left-accent",
                title: 'PDF Uploaded',
                description: 'File Uploaded Successfully',
                status: 'success',
                duration: 9000,
                isClosable: true
            })
            // Close the modal after successful upload
            setIsOpen(false);
        } catch (err) {
            toast({
                position: "top",
                variant: "left-accent",
                title: "OOPS Could not upload PDF",
                description: 'An Error Occured in Uploading the file',
                status: 'error',
                duration: 9000,
                isClosable: true
            })
            console.error('Error uploading PDF:', err);
            // setError('Error uploading PDF');
        }
    };

    const handleSetIsOpen = (bool) => {
        setIsOpen(bool);
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
                    <Button
                        onClick={() => setIsOpen(true)}
                    >
                        Upload Pdf
                    </Button>
                    <UploadPdfModal
                        isOpen={isOpen}
                        setIsOpen={handleSetIsOpen}
                        handlePdfUpload={handlePdfUpload}
                        handlePdfFileChange={handlePdfFileChange}
                    />
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