import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Heading, Text, 
         Box, Button, Input, 
         Modal, ModalOverlay, ModalContent, 
         ModalHeader, ModalCloseButton, ModalBody, 
         ModalFooter, FormControl, FormLabel, IconButton, Link 
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
    // Handles input pdf File
    const [inputPdfFile, setInputPdfFile] = useState(null);
    // New state to track users loading state
    const [usersLoading, setUsersLoading] = useState(true); 
    // New state to track pdfs loading state
    const [pdfsLoading, setPdfsLoading] = useState(true); 
    // Modal state
    const [isOpen, setIsOpen] = useState(false);
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
        // console.log("pdf",pdfs);
        } catch (error) {
          console.error('Error fetching PDFs:', error);
          return [];
        }
      };

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
            console.log('PDF uploaded successfully');
            // Close the modal after successful upload
            setIsOpen(false);
        } catch (err) {
            console.error('Error uploading PDF:', err);
            setError('Error uploading PDF');
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

    const isLoading = usersLoading || pdfsLoading ;

  return (
    <>
        {isLoading? 
            (
                <Box>Loading..</Box>
            )
        :
        (
            <Container
                maxW={"100%"}
            >
                <Heading
                    as = "h2"
                    textAlign={"center"}
                >
                    Hi {user.name}
                </Heading>
                <Text
                    textAlign={"center"}
                >
                    Email: {user.email}
                </Text>
                <Box
                    p = "1em"
                    w= "sm"
                    boxShadow= "2xl"
                    display= "inline-block"
                    borderRadius= "xl"
                >
                    <Heading
                        size="md"
                    >
                        PDF's
                    </Heading>
                    {/* <Text>{pdfs.length} pdf(s)</Text> */}
                    {pdfs.map((pdf)  => (
                        <Box  
                            my = "12px"
                            key={pdf._id}
                        >
                            <FaFilePdf />
                            <Text>{pdf.name}</Text>
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
                                ml = "12px"
                                colorScheme='twitter'
                            >
                                View & Edit
                            </Button>
                        </Box>
                    ))}

                    <Button mt="1em" as={Link} href='/createEnvelope'>Upload PDF</Button>
                    {/* <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Upload PDF</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl>
                                    <FormLabel>Select PDF File:</FormLabel>
                                    <Input type="file" onChange={handlePdfFileChange} />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={handlePdfUpload}>
                                    Upload
                                </Button>
                                <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal> */}
                </Box>
                <Box
                    p = "1em"
                    boxSize= "xs"
                    boxShadow= "2xl"
                    borderRadius= "xl"
                    display= "inline-block"
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
            </Container>
        )}
    </>
  );
};

export default Dashboard;
