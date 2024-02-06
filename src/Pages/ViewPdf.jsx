import { Heading, Box, Button, Text, Flex, Grid, GridItem } from '@chakra-ui/react';
import { Page, Document } from 'react-pdf';
import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Sidebar from '../../components/Sidebar';

const ViewPdf = () => {
    let { id } = useParams();
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    // useEffect(()=>{
    //     fetchPdf();
    // }, [])
    
    // const fetchPdf = async () => {
    //     await axios.get(`http://localhost:3001/pdf/${id}`)
    //     .then(response => {
    //         // console.log("Success in fetching", response.data);
    //         const fileUrl = URL.createObjectURL(response.data);
    //         setFile(fileUrl)
    //     })
    //     .catch(err=> console.log("Error in fetching", err))
    // }

    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return(
        <>
            <Sidebar>
            <Heading>This is edit pdf</Heading>
            <Box
                bg = "grey"
                maxH={"4em"}
            >
                <Text display={"inline-block"}>{pageNumber} of {numPages}</Text>

            </Box>
            <Flex
                bg = "#00000099"
                display = "flex"
                justifyContent= "center"
                alignItems = "center"
                // w = "50em"
            >
                <Document
                    file={`http://localhost:3001/pdf/${id}`}
                    onLoadSuccess={handleDocumentLoadSuccess}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Box
                            my= "12px"
                            key={`page_${index + 1}`}
                        >
                            <Page  pageNumber={index + 1} />
                        </Box>
                    ))}
                </Document>
            </Flex>
            </Sidebar>
        </>
    )
}

export default ViewPdf;