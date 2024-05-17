import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, FormControl,
    Heading, Input, Button,
    useToast, FormLabel, Grid, GridItem, Text, Stack,
    Divider, Flex,
    IconButton
} from '@chakra-ui/react';
import UploadPdfModal from '../../components/ModalsPopover/UploadPdfModal';
import fetchUserDetails from '../../utils/fetchUser';
import { Document, Page } from 'react-pdf';
import { LuUpload, LuLayoutTemplate } from "react-icons/lu";
import { IoMdCloudOutline, IoMdPersonAdd, IoIosClose } from "react-icons/io";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WarningToast from '../../components/Toasts/WarningToast';
import SuccessToast from '../../components/Toasts/SuccessToast';
import ErrorToast from '../../components/Toasts/ErrorToast';

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
            WarningToast("Fields Required", "Please enter both name and email");
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
            SuccessToast('PDF Uploaded','File Uploaded Successfully');
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
            ErrorToast("OOPS Could not upload PDF", 'An Error Occured in Uploading the file');
            console.error('Error uploading PDF:', err);
            // setError('Error uploading PDF');
        }
    };

    const handleSetIsOpen = (bool) => {
        setIsOpen(bool);
    }

    // Handle removing a recipient by index
    const handleRemoveRecipient = (index) => {
        const updatedRecipients = [...recipients];
        updatedRecipients.splice(index, 1); // Remove the recipient at the specified index
        setRecipients(updatedRecipients);
    };


    return (
        <>
            <Navbar />
            <Container
                p="2em"
                maxW="100%"
                bgColor="gray.100"
            >
                <Grid
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(12, 1fr)"
                    gap={4}

                >
                    {inputPdfFile ?
                        <GridItem
                            colSpan={[12, 12, 6,4,4]}
                        >
                            <Box
                                p="2em"
                                // boxSize="xs"
                                h = "100%"
                                boxShadow="xl"
                                borderRadius="2xl"
                                bgColor= "white"
                                position= "relative"
                            >
                                <IconButton 
                                    icon={<IoIosClose />}
                                    position="absolute"
                                    top="0.5em"
                                    right="0.5em"
                                    colorScheme="red"
                                    size="sm"
                                    borderRadius= "full"
                                    onClick={() => setInputPdfFile(null)}
                                    zIndex={2}
                                />
                                <Box
                                    // p = "1em"
                                    border="1px solid black"

                                >
                                    <Document
                                        file={inputPdfFile}
                                    >
                                        <Page pageNumber={1} width={187}/>
                                    </Document>
                                </Box>
                                    <Text>{fileName}</Text>
                            </Box>
                        </GridItem>

                        : null}
                    <GridItem
                        colSpan={[12, 12, 6,4,4]}
                    >
                        <Stack
                            p="2em"
                            h="100%"
                            align= "center"
                            justify={"center"}
                            boxShadow="xl"
                            borderRadius="2xl"
                            backgroundColor="white"
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
                                    colorScheme='primary'
                                    // backgroundColor="primary.500"
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
                                colorScheme='gray'
                                leftIcon={<LuLayoutTemplate />}
                            >
                                Use Template
                            </Button>
                            <Button
                                w="100%"
                                mt="1em"
                                textTransform="capitalize"
                                colorScheme='primary'
                                leftIcon={<IoMdCloudOutline />}
                            >
                                Get From Cloud
                            </Button>
                        </Stack>
                    </GridItem>
                    {recipients.map((recipient, index) => (

                    <GridItem
                        colSpan={[12, 12, 12,4,4]}
                        key={index}
                    >
                        <Flex
                            p="2em"
                            h = "100%"
                            w="full"
                            align= "stretch"
                            justify="center"
                            direction="column"
                            bgColor= "white"
                            boxShadow="2xl"
                            // boxSize= "xs"
                            borderRadius={"xl"}
                            position="relative"
                        >
                            <Heading
                                size="md"
                                as="h3"
                            >
                                Add Recipient&apos;s Details</Heading>
                                <Box >
                                    <FormControl isRequired mt="1em">
                                        <FormLabel fontWeight="bold">Recipient {index + 1}'s Name</FormLabel>
                                        <Input
                                            type='text'
                                            value={recipient.name}
                                            onChange={(e) => handleRecipientChange(e, index, 'name')}
                                        />
                                    </FormControl>
                                    <FormControl isRequired mt="1em">
                                        <FormLabel fontWeight="bold">Recipient {index + 1}'s Email</FormLabel>
                                        <Input
                                            type='email'
                                            value={recipient.email}
                                            onChange={(e) => handleRecipientChange(e, index, 'email')}
                                        />
                                    </FormControl>
                                    {index>0 &&
                                    <IconButton 
                                    icon={<IoIosClose />}
                                    position="absolute"
                                    top="0.5em"
                                    right="0.5em"
                                    colorScheme="red"
                                    size="sm"
                                    borderRadius= "full"
                                    onClick={() => handleRemoveRecipient(index)}
                                    zIndex={2}
                                />
                                    }
                                </Box>
                                {
                                    (index === recipients.length-1) &&
                            <Stack
                                direction={{base: "column",  xl: "row"}}
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
                                    colorScheme='primary'
                                    leftIcon={<IoMdPersonAdd />}
                                    onClick={handleAddRecipients}
                                >
                                    Add Recipient
                                </Button>
                            </Stack>
                                }
                        </Flex>
                    </GridItem>
                ))}

                </Grid>
            </Container>
            <Footer />
        </>
    )
}

export default Envelope;