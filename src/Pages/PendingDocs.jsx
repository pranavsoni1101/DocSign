import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Link, Spinner, Text , Container } from '@chakra-ui/react';
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
                        <Heading>This is sign pdf</Heading>
                        <Box
                            p = "1em"
                            boxShadow= "2xl"
                            borderRadius= "xl"
                            w = "sm"
                        >
                            {files.map((file, index) => (
                                <Box
                                    key={file._id}
                                    mb = "1em"
                                >
                                    <FaFilePdf />
                                    <Text>FileName:     {file.fileName}</Text>
                                    {
                                        file.expiryDate !== null?
                                        <Text>Expiry Date: {formatDateFromISO(file.expiryDate)}</Text>
                                        :
                                         null
                                    }
                                    <Box>
                                        {file.expiryDate?
                                            (<Button
                                                colorScheme='green'
                                                onClick={() => handleAccept(file._id)}
                                            >
                                                Accept to Sign
                                            </Button>)
                                            :
                                            null
                                        }
                                        <br />
                                        <Button
                                            as={Link}
                                            href={`/sign/${file._id}/${file.fileName}`}
                                        >
                                            Sign
                                        </Button>
                                        <br />
                                        <Button
                                            colorScheme='yellow'
                                            onClick={() =>handleDelay(file._id)}
                                        >
                                            Delay In Signing
                                        </Button>
                                        <br />
                                        <Button 
                                            colorScheme='red'
                                            onClick={() => handleReject(file._id)}
                                        >
                                            Reject
                                        </Button>
                                        <br />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                )
            }
        </>
    )
}

export default PendingDocs;