import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, 
         Link, Spinner, Text , 
         Container, Stack, Flex, Spacer, ButtonGroup
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import fetchUserDetails from '../../utils/fetchUser';
import axios from 'axios';
import { FaFilePdf } from "react-icons/fa";

const PendingDocs = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [userLoading, setUserLoading] = useState(true); 
    const [filesLoading, setFilesLoading] = useState(true);
    const [files, setFiles] = useState([]);

    useEffect(()=> {
        fetchUserDetails(navigate, setUser, setUserLoading);
        fetchPendingToBeSignedPdfs();
    }, []);

    const fetchPendingToBeSignedPdfs = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get('http://localhost:3001/pdf/pending/toBeSignedPdf', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Pendinggggg", response.data);
            setFiles(response.data);
            setFilesLoading(false);
        }
        catch (error) {
            console.log("Errrorr", error);
        }
        
    };

    const handleAccept = async (pdfID) => {
        try{
            const token = sessionStorage.getItem("token");
            console.log("this toke", token);
            await axios.post(`http://localhost:3001/pdf/pdfs/${pdfID}/accept`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {console.log("Hurray Accepted!!!");fetchPendingToBeSignedPdfs()})
        }
        catch (error) {
            console.log("Error updating Acceptance", error);
        }
    };

    const handleDelay = async (pdfID) => {
        try{
            const token = sessionStorage.getItem("token");
            console.log("this toke", token);
            await axios.post(`http://localhost:3001/pdf/pdfs/${pdfID}/delay`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {console.log("Hurray Delayed!!!");fetchPendingToBeSignedPdfs()})
        }
        catch (error) {
            console.log("Error updating Delay", error);
        }
    };

    const handleReject = async (pdfID) => {
        try{
            const token = sessionStorage.getItem("token");
            console.log("this toke", token);
            await axios.post(`http://localhost:3001/pdf/pdfs/${pdfID}/reject`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {console.log("Hurray Rejected!!!");fetchPendingToBeSignedPdfs()})
        }
        catch (error) {
            console.log("Error updating rejection", error);
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
    };

    const isLoading = userLoading || filesLoading;

    return(
        <>
            {
                isLoading? 
                    (
                        <Spinner 
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
                        maxW= "100%"
                    >
                        <Container
                            mt = "1em"
                            maxW= "4xl"
                            p = "1em"
                            boxShadow="2xl"
                            borderRadius = "md"
                            backgroundColor="gray.500"
                        >
                            <Stack
                                w = "100%"
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
                                        Welcome to the Unfinished Symphony: 
                                        Where Important Docs Await Your Signature!
                                    </Text>
                                </Flex>
                                {files.map((file, index) => (
                                    <Flex
                                        p = "12px"
                                        key={file._id}
                                        boxShadow= "lg"
                                        borderRadius= "2xl"
                                        backgroundColor="primary.500"
                                    >
                                        <Box>
                                            <Text
                                                fontWeight= "600"
                                            >
                                                <FaFilePdf />
                                                {file.fileName}
                                            </Text>
                                            {
                                                file.expiryDate !== null?
                                                <Text><strong>Expiry Date: </strong>{formatDateFromISO(file.expiryDate)}</Text>
                                                :
                                                <Text>Fear not, for this doc has an eternal life - it'll never expire!</Text>
                                            }
                                        </Box>
                                        <Spacer />
                                        <ButtonGroup>
                                            <Button
                                                colorScheme='green'
                                                onClick={() => handleAccept(file._id)}
                                            >
                                                Accept to Sign
                                            </Button>
                                            <Button
                                                as={Link}
                                                href={`/sign/${file._id}/${file.fileName}`}
                                            >
                                                Sign
                                            </Button>
                                            <Button
                                                colorScheme='yellow'
                                                onClick={() =>handleDelay(file._id)}
                                            >
                                                Delay In Signing
                                            </Button>
                                            <Button 
                                                colorScheme='red'
                                                onClick={() => handleReject(file._id)}
                                            >
                                                Reject
                                            </Button>    
                                        </ButtonGroup>
                                    </Flex>
                                ))}
                            </Stack>
                        </Container>
                    </Container>
                )
            }
        </>
    )
}

export default PendingDocs;