import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, FormControl,
    Heading, Input, Button,
    useToast, FormLabel, Grid, GridItem, Text, ButtonGroup
} from '@chakra-ui/react';
import UploadPdfModal from '../../components/ModalsPopover/UploadPdfModal';
import fetchUserDetails from '../../utils/fetchUser';
import { Document, Page } from 'react-pdf';
import { LuUpload, LuLayoutTemplate } from "react-icons/lu";
import { IoMdCloudOutline, IoMdPersonAdd } from "react-icons/io";
import Footer from '../../components/Footer';

const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const Envelope = () => {
    const navigate = useNavigate();
    // const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [inputPdfFile, setInputPdfFile] = useState(null);
    const [recipients, setRecipients] = useState([{ name: '', email: '' }]);
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [usersLoading, setUsersLoading] = useState(true);
    const [fileName, setFileName] = useState("")

    const toast = useToast();

    // Logic to redirect user if the token is not found in the sessionStorage
    useEffect(() => {
        fetchUserDetails(navigate, setUser, setUsersLoading)
    }, [])

    const handleRecipientChange = (event, index, field) => {
        const { value } = event.target;
        const updatedRecipients = [...recipients];
        updatedRecipients[index][field] = value;
        setRecipients(updatedRecipients);
    };
    
    // // Handle Name input change and store to state
    // const handleNameChange = (event) => {
    //     setName(event.target.value);
    // }

    // // Handle Email input change and store to state
    // const handleEmailChange = (event) => {
    //     setEmail(event.target.value);
    // }

    // Handle File Input Change
    const handlePdfFileChange = (e) => {
        setInputPdfFile(e.target.files[0]);
        setFileName(e.target.files[0].name)
        setTimeout(() => {
            setIsOpen(false)

        }, 1000)
    };

    const handleAddRecipients = () => {
        setRecipients([...recipients, { name: '', email: '' }]);
    }
     console.log("recipients", recipients);
    // Handle PDF upload
    const handlePdfUpload = async () => {
        if (recipients.some(recipient => !recipient.name.trim() || !recipient.email.trim())) {
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
            formData.append('recipients', JSON.stringify(recipients));
            // Make a POST request to upload the PDF file
            const response = await axios.post(`${DOMAIN_NAME}/pdf/${user.id}/pdfs`, formData, {
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

            // Handling the new Uploaded file data
            const newPdf = response.data;

            console.log("newly uploaded", newPdf);
            setInputPdfFile(null);
            setName("");
            setEmail("");
            navigate(`/pdf/${newPdf.id}/${newPdf.fileName}`);
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
                            p="2em"
                            // h="xs"
                            boxShadow="xl"
                            borderRadius="2xl"
                            backgroundColor="gray.400"
                        >
                            <Box
                                w="100%"
                                position="relative"
                            >
                                <Input
                                    type='file'
                                    onChange={handlePdfFileChange}
                                    position="absolute"
                                    // w = "2xs"
                                    // bottom= {0}
                                    // h = "100%"
                                    opacity={0}
                                    cursor="pointer"
                                    zIndex={1}
                                />
                                <Button
                                    w="100%"
                                    // mt="1em"
                                    textTransform="capitalize"
                                    backgroundColor="primary.500"
                                    leftIcon={<LuUpload />}
                                    _hover={{
                                        backgroundColor: "gray.500",
                                        color: "primary.500"
                                    }}
                                >
                                    Upload PDF
                                </Button>
                            </Box>
                            <UploadPdfModal
                                isOpen={isOpen}
                                setIsOpen={handleSetIsOpen}
                                // handlePdfUpload={handlePdfUpload}
                                handlePdfFileChange={handlePdfFileChange}
                            />
                            <Button
                                w="100%"
                                mt="1em"
                                textTransform="capitalize"
                                backgroundColor="gray.500"
                                color="primary.500"
                                leftIcon={<LuLayoutTemplate />}
                                _hover={{
                                    color: "gray.500",
                                    backgroundColor: "primary.500",

                                }}
                            >
                                Use Template
                            </Button>
                            <Button
                                w="100%"
                                mt="1em"
                                textTransform="capitalize"
                                backgroundColor="primary.500"
                                leftIcon={<IoMdCloudOutline />}
                                _hover={{
                                    backgroundColor: "gray.500",
                                    color: "primary.500"
                                }}
                            >
                                Get From Cloud
                            </Button>
                        </Box>
                    </GridItem>
                    <GridItem
                        colSpan={3}
                    // colStart={1}
                    // colEnd={7}
                    >
                        <Box
                            p="2em"
                            // w="lg"
                            boxShadow="2xl"
                            // boxSize= "xs"
                            borderRadius={"xl"}
                            backgroundColor="primary.400"
                        >
                            <Heading
                                size="md"
                                as="h3"
                            >
                                Add Recipient&#40;s&#41; Details</Heading>
                                {recipients.map((recipient, index) => (
    <Box key={index}>
        <FormControl isRequired mt="1em">
            <FormLabel fontWeight="bold">Recipient {index + 1}'s Name</FormLabel>
            <Input
                type='text'
                value={recipient.name}
                onChange={(e) => handleRecipientChange(e, index, 'name')}
                placeholder='John Doe'
                borderColor="gray.500"
                focusBorderColor='gray.500'
            />
        </FormControl>
        <FormControl isRequired mt="1em">
            <FormLabel fontWeight="bold">Recipient {index + 1}'s Email</FormLabel>
            <Input
                type='email'
                value={recipient.email}
                onChange={(e) => handleRecipientChange(e, index, 'email')}
                placeholder='johndoe@something.com'
                borderColor="gray.500"
                focusBorderColor='gray.500'
            />
        </FormControl>
    </Box>
))}

                            <ButtonGroup
                                mt="1em"
                            >
                                <Button
                                    colorScheme='green'
                                    onClick={handlePdfUpload}
                                    leftIcon={<LuUpload />}
                                >
                                    Upload
                                </Button>
                                <Button
                                    color= "primary.500"
                                    backgroundColor= "gray.500"
                                    leftIcon={<IoMdPersonAdd />}
                                    onClick={handleAddRecipients}
                                    _hover={{
                                        backgroundColor: "gray.600"
                                    }}
                                >
                                    Add Recipient
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </GridItem>
                </Grid>
            </Container>
            <Footer />
        </>
    )
}

export default Envelope;