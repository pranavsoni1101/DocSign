import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, FormControl,
    Heading, Input, Button,
    useToast, FormLabel, Grid, GridItem, Text
} from '@chakra-ui/react';
import UploadPdfModal from '../../components/ModalsPopover/UploadPdfModal';
import fetchUserDetails from '../../utils/fetchUser';
import { Document, Page } from 'react-pdf';

const Envelope = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [inputPdfFile, setInputPdfFile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [usersLoading, setUsersLoading] = useState(true);
    const [fileName, setFileName] = useState("")

    const toast = useToast();

    // Logic to redirect user if the token is not found in the sessionStorage
    useEffect(() => {
        fetchUserDetails(navigate, setUser, setUsersLoading)
    }, [])

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
        setFileName(e.target.files[0].name)
        setTimeout(() => {
            setIsOpen(false)

        }, 1000)
    };

    // Handle PDF upload
    const handlePdfUpload = async () => {
        if (!name.trim() || !email.trim()) {
            toast({
                position: "top",
                variant: "left-accent",
                title: "Fields Required",
                description: "Please enter both name and email",
                status: "warning",
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        try {
            const formData = new FormData();
            formData.append('pdf', inputPdfFile);
            formData.append('recipientName', name);
            formData.append('recipientEmail', email);
            // Make a POST request to upload the PDF file
            const response = await axios.post(`http://localhost:3001/pdf/${user.id}/pdfs`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.id}` // Pass the user ID in the Authorization header
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

    return (
        <>
            <Container
                p="2em"
                maxW="100%"
            >
                <Grid
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(12, 1fr)"
                    gap={4}

                >
                    {inputPdfFile ?
                        <GridItem
                            colSpan={3}
                        >
                            <Box
                                p="1em"
                                boxSize="xs"
                                boxShadow="xl"
                                borderRadius="2xl"
                            >
                                <Box
                                    border="1px solid black"

                                >
                                    <Document
                                        file={inputPdfFile}
                                    >
                                        <Page pageNumber={1} width={200} />
                                    </Document>
                                    <Text>{fileName}</Text>
                                </Box>
                            </Box>
                        </GridItem>

                        : null}
                    <GridItem
                        colSpan={3}
                    >
                        <Box
                            p="1em"
                            // my= "3"
                            boxSize="xs"
                            boxShadow="xl"
                            borderRadius="2xl"
                        >
                            <Button
                                w="100%"
                                mt="1em"
                                textTransform="uppercase"
                                onClick={() => setIsOpen(true)}
                            >
                                Upload PDF
                            </Button>
                            <UploadPdfModal
                                isOpen={isOpen}
                                setIsOpen={handleSetIsOpen}
                                // handlePdfUpload={handlePdfUpload}
                                handlePdfFileChange={handlePdfFileChange}
                            />
                            <Button
                                w="100%"
                                mt="1em"
                                textTransform="uppercase"
                            >
                                Use Template
                            </Button>
                            <Button
                                w="100%"
                                mt="1em"
                                textTransform="uppercase"
                            >
                                Get From CLoud
                            </Button>
                        </Box>
                    </GridItem>
                    <GridItem
                        colSpan={6}
                    >
                        <Box
                            p="2em"
                            w="sm"
                            boxShadow="xl"
                            boxSize= "xs"
                            borderRadius={"xl"}
                        >
                            <Heading
                                size="sm"
                                as="h3"
                            >
                                Add Recipient's Details</Heading>
                            <FormControl
                                isRequired
                                mt="1em"
                            >
                                <FormLabel>Recipient's Name</FormLabel>
                                <Input
                                    // mt = "1em" 
                                    type='text'
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder='John Doe'
                                />
                            </FormControl>
                            <FormControl
                                isRequired
                            >
                                <FormLabel>Recipient's Email</FormLabel>
                                <Input
                                    // mt = "1em" 
                                    type='email'
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder='johndoe@something.com'
                                />
                            </FormControl>
                            <Button
                                mt="1em"
                            >
                                Add Recipient
                            </Button>
                        </Box>
                        <Button colorScheme='green' onClick={handlePdfUpload}>Upload pDF</Button>
                    </GridItem>
                </Grid>
            </Container>

        </>
    )
}

export default Envelope;