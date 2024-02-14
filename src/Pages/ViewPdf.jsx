import React, { useEffect, useState } from 'react';
import { Heading, Box, Button, 
        Text, Flex, Grid, 
        GridItem, Input 
} from '@chakra-ui/react';
import { Page, Document } from 'react-pdf';
import { useNavigate, useParams } from 'react-router-dom';
import { useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaDownload } from "react-icons/fa6";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Sidebar from '../../components/Sidebar';
import NameInput from '../../components/DraggableInputs/NameInput';
import fetchUserDetails from '../../utils/fetchUser';
import SignatureInput from '../../components/DraggableInputs/SignatureInput';

const ViewPdf = () => {
    let { id, fileName } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [inputFields, setInputFields] = useState([]);
    const [dragEnabled, setDragEnabled] = useState(false); // State to track drag enablement
    const [usersLoading, setUsersLoading] = useState(true); 
    useEffect(()=> {
        fetchUserDetails(navigate, setUser, setUsersLoading);
    }, [])

    const handleAddInputField = (e, pageIndex) => {
        if(!dragEnabled) return;

        const pdfViewer = document.querySelector('.page');
        console.log('pdf viewer0', pdfViewer);
        const rect = pdfViewer.getBoundingClientRect();

        // Calculate the position of the input field relative to the PDF
        // const boundingRect = e.target.getBoundingClientRect();
        // const x = e.clientX - rect.left;
        // const y = e.clientY - rect.top ;
        const x = (e.clientX - rect.left) * (pdfViewer.clientWidth / rect.width) + pdfViewer.scrollLeft;
        const y = (e.clientY - rect.top) * (pdfViewer.clientHeight / rect.height) + pdfViewer.scrollTop;
            
        // Add the input field position and page index to the list
        setInputFields([...inputFields, { x, y, pageIndex }]);
    };
    
    
    

    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    // Function to toggle drag enablement
    const toggleDrag = () => {
        setDragEnabled(!dragEnabled);
    };

    const handleSetIsOpen = (bool) => {
        setIsOpen(bool);
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

    return(
        <>
        {usersLoading? 
            (
                <Box>Loading..</Box>
            )
        :
            (
            <DndProvider backend={HTML5Backend}>
                <Sidebar
                    toggleDrag = {toggleDrag}
                >
                <Flex
                    p = "12px"
                    justify="space-between"
                    bg = "grey"
                    maxH={"4em"}
                >
                    <Text display={"inline-block"}>{pageNumber} of {numPages}</Text>
                    <Button
                        // variant= "outline"
                        colorScheme='twitter'
                        rightIcon={<FaDownload />}
                        onClick={handleDownload}
                    >
                        Download
                    </Button>
                </Flex>
                <Flex
                    bg = "#00000099"
                    display = "flex"
                    justifyContent= "center"
                    userSelect="none"
                    alignItems = "center"
                >
                    <Document
                        file={`http://localhost:3001/pdf/${user.id}/pdfs/${id}`}
                        onLoadSuccess={handleDocumentLoadSuccess}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <Box
                                my= "12px"
                                key={`page_${index + 1}`}
                            >
                                <Page  pageNumber={index + 1}
                                    className={"page"}
                                    onClick={(e) => handleAddInputField(e, index)}
                                />
                                {/* Render input fields dynamically based on recorded positions */}
                                {inputFields
                                .filter(field => field.pageIndex === index)
                                .map((field, idx) => (
                                    // <SignatureInput 
                                    //     key={idx} 
                                    //     x={field.x} 
                                    //     y={field.y} 
                                    //     index={index} 
                                    //     isOpen={isOpen}
                                    //     setIsOpen={setIsOpen}
                                    //     handleSetIsOpen={handleSetIsOpen}
                                    //     user = {user}
                                    //     />
                                    <NameInput key={idx} x={field.x} y={field.y} index={index} />
                                ))}
                            </Box>
                        ))}
                    </Document>
                </Flex>
                </Sidebar>
            </DndProvider>
            )}
            </>
)}

export default ViewPdf;
