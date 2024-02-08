import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Heading, Text,
    Box, Button, IconButton, Link, Grid, GridItem
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import fetchUserDetails from '../../utils/fetchUser';

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
            const response = await axios.get(`http://localhost:3001/pdf/${user.id}/pdfs`);
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
            await axios.delete(`http://localhost:3001/pdf/${user.id}/pdfs/${pdfId}`, {
                headers: {
                    'Authorization': `Bearer ${user.id} ` // Pass the user ID in the Authorization header
                }
            });
            console.log('PDF deleted successfully');
            // Update the PDFs state to reflect the deletion
            setPdfs(prevPdfs => prevPdfs.filter(pdf => pdf._id !== pdfId));
        } catch (err) {
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
                    <Box>Loading..</Box>
                )
                :
                (
                    <Container
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
                        <Grid
                            templateRows="repeat(2, 1fr)"
                            templateColumns="repeat(12, 1fr)"
                            gap={4}
                        >
                            <GridItem
                            // colSpan={}
                            >
                                <Box
                                    p="1em"
                                    w="sm"
                                    boxShadow="2xl"
                                    display="inline-block"
                                    borderRadius="xl"
                                >
                                    <Heading
                                        size="md"
                                    >
                                        PDF's
                                    </Heading>
                                    {pdfs.map((pdf) => (
                                        <Box
                                            my="12px"
                                            key={pdf._id}
                                        >
                                            <FaFilePdf />
                                            <Text>{pdf.name}</Text>
                                            <Text>{pdf.size} bytes</Text>
                                            <Text>{formatDateFromISO(pdf.uploadedAt)}</Text>
                                            <Box>
                                            </Box>
                                            <IconButton
                                                colorScheme='red'
                                                onClick={() => handleDeletePdf(pdf._id)}
                                            >
                                                <MdDelete />
                                            </IconButton>
                                            <Button
                                                as={Link}
                                                href={`/pdf/${pdf._id}`}
                                                ml="12px"
                                                colorScheme='twitter'
                                            >
                                                View & Edit
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>

                            </GridItem>
                            <GridItem
                            // colSpan={}
                            >
                                <Box
                                    p="1em"
                                    boxSize="xs"
                                    boxShadow="2xl"
                                    borderRadius="xl"
                                    display="inline-block"
                                >
                                    <Heading
                                        size="md"
                                    >
                                        Create an envelope
                                    </Heading>
                                    <Button
                                        as={Link}
                                        href='/createEnvelope'
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </GridItem>
                        </Grid>
                    </Container>
                )}
        </>
    );
};

export default Dashboard;
