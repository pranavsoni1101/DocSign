import React, { useState } from 'react';
import { Heading, Box, Button, 
        Text, Flex, Grid, 
        GridItem, Input 
} from '@chakra-ui/react';
import { Page, Document } from 'react-pdf';
import { useParams } from 'react-router-dom';
import { useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Sidebar from '../../components/Sidebar';

const ViewPdf = () => {
    let { id } = useParams();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [inputFields, setInputFields] = useState([]);
    const [dragEnabled, setDragEnabled] = useState(false); // State to track drag enablement

    const handleAddInputField = (e, pageIndex) => {
        if(!dragEnabled) return;
        // Calculate the position of the input field relative to the PDF
        const boundingRect = e.target.getBoundingClientRect();
        const x = e.clientX - boundingRect.left + window.pageXOffset;
        const y = e.clientY - boundingRect.top + window.pageYOffset;
        
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
            <DndProvider backend={HTML5Backend}>
                {/* <Sidebar > */}
                <Heading>This is edit pdf</Heading>
                <Box
                    bg = "grey"
                    maxH={"4em"}
                >
                    <Text display={"inline-block"}>{pageNumber} of {numPages}</Text>
                    <Button onClick={toggleDrag}>
                        {dragEnabled ? 'Disable Drag' : 'Enable Drag'}
                    </Button>
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
                                <Page  pageNumber={index + 1}
                                    onClick={(e) => handleAddInputField(e, index)}
                                />
                                {/* Render input fields dynamically based on recorded positions */}
                                {inputFields
                                .filter(field => field.pageIndex === index)
                                .map((field, idx) => (
                                    <DraggableInput key={idx} x={field.x} y={field.y} index={index} />
                                ))}
                            </Box>
                        ))}
                    </Document>
                </Flex>
                {/* </Sidebar> */}
            </DndProvider>

        </>
    )
}

const DraggableInput = ({ x, y, index }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'input',
        item: {  x, y },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <Box
            ref={drag}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <Input size="xs"w ="sm" zIndex={2} bg="pink" type="text" placeholder={`${index} input position is x: ${x} and y: ${y}`}/>
        </Box>
    );
};

export default ViewPdf;
