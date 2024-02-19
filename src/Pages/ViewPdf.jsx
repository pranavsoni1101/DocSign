import React, { useEffect, useState, useRef } from 'react';
import { Heading, Box, Button, Text, Flex, Input, Spinner } from '@chakra-ui/react';
import { Page, Document } from 'react-pdf';
import { useNavigate, useParams } from 'react-router-dom';
import { FaDownload } from "react-icons/fa6";
import Draggable from 'react-draggable';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Sidebar from '../../components/Sidebar';
import fetchUserDetails from '../../utils/fetchUser';

const ViewPdf = () => {
    let { id, fileName } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [usersLoading, setUsersLoading] = useState(true); 
    const inputFieldRef = useRef(null); // Ref for input field
    const [inputField, setInputField] = useState(null); // State to store the position and value of the input field

    useEffect(()=> {
        fetchUserDetails(navigate, setUser, setUsersLoading);
    }, []);

    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleDownload = async () => {
        try {
            const pdfBlob = await fetch(`http://localhost:3001/pdf/${user.id}/pdfs/${id}`).then(res => res.blob());
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    const addInputField = () => {
        if (!inputField) {
            setInputField({ x: 0, y: 0, value: '' });
        }
    };

    const handleDrag = (e, ui) => {
        if (ui.position) {
            const { x, y } = ui.position;
            setInputField(prevInputField => ({
                ...prevInputField,
                x,
                y
            }));
            inputFieldRef.current.style.transform = `translate(${x}px, ${y}px)`; // Update position using ref
        }
    };

    return(
        <>
        {usersLoading ? 
            (
                <Spinner 
                    position= "fixed"
                    top= "50%"
                    left= "50%"
                    size = "xl"
                    transform= "translate(-50%, -50%)"
                />
            ) : (
                <Sidebar>
                    <Flex
                        p="12px"
                        justify="space-between"
                        bg="grey"
                        maxH={"4em"}
                    >
                        <Text display={"inline-block"}>{pageNumber} of {numPages}</Text>
                        <Button
                            colorScheme='twitter'
                            rightIcon={<FaDownload />}
                            onClick={handleDownload}
                        >
                            Download
                        </Button>
                        <Button onClick={addInputField}>Add Input</Button> {/* Button to add input field */}
                    </Flex>
                    <Flex
                        bg="#00000099"
                        display="flex"
                        justifyContent="center"
                        userSelect="none"
                        alignItems="center"
                    >
                        <Document
                            file={`http://localhost:3001/pdf/${user.id}/pdfs/${id}`}
                            onLoadSuccess={handleDocumentLoadSuccess}
                        >
                            {Array.from(new Array(numPages), (el, index) => (
                                <Box
                                    my="12px"
                                    key={`page_${index + 1}`}
                                >
                                    <Page  pageNumber={index + 1} className={"page"} />
                                    {/* Render input field if it exists */}
                                    {inputField && (
                                        <Draggable
                                            onDrag={handleDrag}
                                            defaultPosition={{ x: inputField.x, y: inputField.y }}
                                        >
                                            <Input 
                                                ref={inputFieldRef}
                                                zIndex={2} 
                                                size="xs"
                                                w="xs"
                                                placeholder={`x: ${inputField.x} y: ${inputField.y} at ${index + 1} page`}
                                                style={{ position: 'absolute', left: inputField.x, top: inputField.y }}
                                                value={inputField.value}
                                                onChange={(e) => setInputField(prevInputField => ({ ...prevInputField, value: e.target.value }))}
                                            />
                                        </Draggable>
                                    )}
                                </Box>
                            ))}
                        </Document>
                    </Flex>
                </Sidebar>
            )
        }
        </>
    );
};

export default ViewPdf;
