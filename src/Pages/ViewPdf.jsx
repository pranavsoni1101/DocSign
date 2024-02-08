import React, { useEffect, useState } from 'react';
import { Heading, Box, Button, 
        Text, Flex, Grid, 
        GridItem, Input 
} from '@chakra-ui/react';
import { Page, Document } from 'react-pdf';
import { useNavigate, useParams } from 'react-router-dom';
import { useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Sidebar from '../../components/Sidebar';
import NameInput from '../../components/DraggableInputs/NameInput';
import fetchUserDetails from '../../utils/fetchUser';

const ViewPdf = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
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
        // Calculate the position of the input field relative to the PDF
        const boundingRect = e.target.getBoundingClientRect();
        const x = e.clientX - boundingRect.left + window.scrollX;
        const y = e.clientY - boundingRect.top + window.scrollY;
        
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
                        file={`http://localhost:3001/pdf/${user.id}/pdfs/${id}`}
                        onLoadSuccess={handleDocumentLoadSuccess}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <Box
                                my= "12px"
                                key={`page_${index + 1}`}
                            >
                                <Page  pageNumber={index + 1}
                                    onClick={(e) => handleAddInputField(e, index)}
                                />
                                {/* Render input fields dynamically based on recorded positions */}
                                {inputFields
                                .filter(field => field.pageIndex === index)
                                .map((field, idx) => (
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
