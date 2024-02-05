import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Heading, Text, Box, Button, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [pdfs, setPdfs] = useState(null)
  const [isLoading, setIsLoading] = useState(true); // New state to track loading state
  const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
        fetchPDFs();
      }, [navigate]);
      
    //   To fetch User Details
      const fetchUserDetails = async () => {
        try {
          // Check if token exists in session storage
          const token = sessionStorage.getItem('token');
          if (!token) {
            // If token doesn't exist, redirect to login
            navigate("/login");
            return;
          }
          
          // Make a GET request to the /user endpoint with the token as a bearer token
          const response = await axios.get('http://localhost:3001/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Set the user state with the received user details
          setUser(response.data);
          setIsLoading(false); // Set loading state to false after user details are fetched
        //   console.log("State", user);
        //   console.log(response.data);
        } catch (err) {
          console.error('Error fetching user details:', err);
          setError('Error fetching user details');
        }
      };
    
    // To fetch user uploaded files
    const fetchPDFs = async () => {
        try {
          // Make a GET request to the endpoint that serves PDFs
          const response = await axios.get('http://localhost:3001/pdf');
          // Extract the PDFs from the response data
          const pdfFiles = response.data;
        //   return pdfs;
        setPdfs(pdfFiles);
        console.log("pdf",pdfs);
        } catch (error) {
          console.error('Error fetching PDFs:', error);
          return [];
        }
      };

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
                    boxSize= "xs"
                    boxShadow= "2xl"
                    borderRadius= "xl"
                >
                    <Heading
                        size="md"
                    >
                        PDF's
                    </Heading>
                    <Button
                        mt = "1em"
                        as = {Link}
                        href='/uploadPdf'
                    >
                        Upload PDF
                    </Button>
                </Box>
            </Container>
        )}
    </>
  );
};

export default Dashboard;
