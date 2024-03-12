import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Heading, Text,
    Box, Button, IconButton, 
    Link, Grid, GridItem, 
    useToast, Spinner, Flex, Spacer, ButtonGroup, Stack
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import fetchUserDetails from '../../utils/fetchUser';
import { FaEnvelopeOpenText } from "react-icons/fa";

const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const Dashboard = () => {
    // Stores the user details
    const [user, setUser] = useState(null);
    // Stores if any error occurs
    const [error, setError] = useState(null);
    // Fetches all the pdfs a user has uploaded 
    const [pdfs, setPdfs] = useState([]);
    // New state to track users loading state
    const [usersLoading, setUsersLoading] = useState(true);
    // New state to track pdfs loading state
    const [pdfsLoading, setPdfsLoading] = useState(true);
    // To redirect a user if they are not logged in
    const navigate = useNavigate();

    const toast = useToast();

    useEffect(() => {
        fetchUserDetails(navigate, setUser, setUsersLoading);
    }, [navigate]); // Only fetch user details when navigating

    useEffect(() => {
        if (user) { // Check if user state is not null
            fetchPDFs(); // Call fetchPDFs only when user state is set
        }
    }, [user]); // Fetch PDFs when user state changes

    // To fetch user uploaded files
    const fetchPDFs = async () => {
        try {
            // Make a GET request to the endpoint that serves PDFs
            const response = await axios.get(`${DOMAIN_NAME}/pdf/${user.id}/pdfs`);
            // Extract the PDFs from the response data
            const pdfFiles = response.data;
            //   return pdfs;
            setPdfs(pdfFiles);
            setPdfsLoading(false);
        } catch (error) {
            console.error('Error fetching PDFs:', error);
            return [];
        }
    };

    // DELETE delete a PDF file by ID
    const handleDeletePdf = async (pdfId) => {
        try {
            // Make a DELETE request to delete the PDF file
            await axios.delete(`${DOMAIN_NAME}/pdf/${user.id}/pdfs/${pdfId}`, {
                headers: {
                    'Authorization': `Bearer ${user.id} ` // Pass the user ID in the Authorization header
                }
            });
            toast({
                position: "top",
                variant: "left-accent",
                title: "PDF Deleted!",
                description: "File Deleted Successfully",
                status: "success",
                duration: 9000,
                isClosable: true
            });
            console.log('PDF deleted successfully');
            // Update the PDFs state to reflect the deletion
            setPdfs(prevPdfs => prevPdfs.filter(pdf => pdf._id !== pdfId));
        } catch (err) {
            toast({
                position: "top",
                variant: "left-accent",
                title: "OOPS PDF not Deleted!",
                description: "Error Deleting the File",
                status: "error",
                duration: 9000,
                isClosable: true
            });
            console.error('Error deleting PDF:', err);
            setError('Error deleting PDF');
        }
    };
    const formatDateFromISO = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    const isLoading = usersLoading || pdfsLoading;

    return (
        <>
            {isLoading ?
                (
                    <Spinner 
                    // m = "0 auto "
                    position= "fixed"
                    top= "50%"
                    left= "50%"
                    size = "xl"
                    transform= "translate(-50%, -50%)"
                />
                )
                :
                (
                    <Container
                        mt = "1em"
                        maxW={"100%"}
                    >
                        <Heading
                            as="h2"
                            textAlign={"center"}
                        >
                            Hi {user.name}
                        </Heading>
                        <Text
                            textAlign={"center"}
                        >
                            Email: {user.email}
                        </Text>
                        <Container
                            mt = "1em"
                            maxW= "4xl"
                            p = "1em"
                            boxShadow="2xl"
                            borderRadius = "md"
                            backgroundColor="gray.500"
                        >
                            <Stack
                                w= "100%"
                            >
                                <Flex
                                    p = "12px"
                                    boxShadow= "lg"
                                    borderRadius= "2xl"
                                    backgroundColor="gray.100"
                                >
                                    <Text
                                        w = "sm"
                                        as = "h3"        
                                        fontSize= "lg"
                                        fontWeight="bold"
                                    >
                                        Ready to sprinkle some digital magic on those documents? 
                                        Let's seal the deal! Create an envelope now!
                                    </Text>
                                    <Spacer/>
                                    <Button
                                        as={Link}
                                        href='/createEnvelope'
                                        backgroundColor= "primary.500"
                                        leftIcon={<FaEnvelopeOpenText />}
                                        transition= "all 0.5s ease-in-out"
                                        _hover={{
                                            color: "primary.500",
                                            backgroundColor: "gray.500",
                                            textDecoration: "none"
                                        }}
                                    >
                                        Envelope
                                    </Button>
                                </Flex>
                                {pdfs.length !== 0 ? pdfs.map((pdf) => (
                                    <Flex
                                        p = "12px"
                                        key={pdf._id}
                                        boxShadow= "lg"
                                        borderRadius= "2xl"
                                        backgroundColor="primary.500"
                                    >
                                        <Box>            
                                            <FaFilePdf />
                                            <Text
                                                fontWeight= "600"
                                            >
                                                {pdf.fileName}
                                            </Text>
                                            <Text
                                                fontWeight= "600"
                                            >
                                                {pdf.size} bytes
                                            </Text>
                                            <Text
                                                fontWeight= "600"
                                            >
                                                {formatDateFromISO(pdf.uploadedAt)}
                                            </Text>
                                        </Box>
                                        <Spacer />
                                        <ButtonGroup>
                                                <Button
                                                    as={Link}
                                                    href={`/pdf/${pdf._id}/${pdf.fileName}/`}
                                                    // ml="12px"
                                                    backgroundColor = "gray.500"
                                                    color = "primary.500"
                                                    transition= "all 0.5s ease-in-out"
                                                    _hover={{
                                                        textDecoration: "none",
                                                        backgroundColor: "gray.100",
                                                        color: "black"
                                                    }}
                                                >
                                                    View & Edit
                                                </Button>
                                                <IconButton
                                                    colorScheme='red'
                                                    onClick={() => handleDeletePdf(pdf._id)}
                                                >
                                                    <MdDelete />
                                                </IconButton>
                                        </ButtonGroup>
                                    </Flex>
                                ))
                                :
                                <Flex
                                        p = "12px"
                                        boxShadow= "lg"
                                        borderRadius= "2xl"
                                        backgroundColor="primary.500"
                                    >
                                    <Text
                                        as = "h3"
                                        w = "md"
                                        fontSize= "lg"
                                        fontWeight="bold"
                                    >
                                        Let's give those PDFs a digital home! 
                                        Time to create some envelopes and peek 
                                        inside for a whimsical view of your uploaded documents.
                                    </Text>                                
                                </Flex>
                            }
                            </Stack>
                        </Container>
                    </Container>
                )}
        </>
    );
};

export default Dashboard;
