import React, { useEffect, useState, useRef } from 'react';
import { Heading, Box, Button, Text, Flex, Input, Spinner, IconButton, position } from '@chakra-ui/react';
import { Page, Document, pdfjs } from 'react-pdf';
import { useNavigate, useParams } from 'react-router-dom';
import { FaDownload } from "react-icons/fa6";
import Draggable from 'react-draggable';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DrawArea from "../../components/DrawArea";
import AutoTextArea from "../../components/AutoTextArea"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Sidebar from '../../components/Sidebar';
import fetchUserDetails from '../../utils/fetchUser';
import SuccessToast from '../../components/Toasts/SuccessToast';
import ErrorToast from '../../components/Toasts/ErrorToast';

const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const ViewPdf = () => {
    const dragRef = useRef(null);
    let { id, fileName } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [usersLoading, setUsersLoading] = useState(true); 
    const [inputFields, setInputFields] = useState([]); // State to store input fields
    const inputFieldRef = useRef(null); // Ref for input field
    
    
    // Number of pages in a pdf
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    // Text area related
    const [result, setResult] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [flag, setFlag] = useState("");
    const [buttonType, setButtonType] = useState("");
    const [isText, setIsText] = useState(false);
    const [bounds, setBounds] = useState({});
    const [isSendLoading, setIsSendLoading] = useState(false);

    const tempRef = useRef(null);

    useEffect(()=> {
        fetchUserDetails(navigate, setUser, setUsersLoading);
    }, []);

    // useEffect(() => {
    //     console.log("Updated position:", inputFields);
    // }, [inputFields]);

    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1)
    };

    const handleDownload = async () => {
        try {
            const pdfBlob = await fetch(`${DOMAIN_NAME}/pdf/${user.id}/pdfs/${id}`).then(res => res.blob());
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

    const handleAddInputField = () => {
        setInputFields(prevInputFields => [
            ...prevInputFields,
            { x: 0, y: 0}
        ]);
    };

    const handleDrag = (pageIndex, inputIndex, e, ui) => {
        setInputFields(prevInputFields => {
            const updatedInputFields = [...prevInputFields];
            updatedInputFields[inputIndex] = {
                ...updatedInputFields[inputIndex],
                x: ui.x,
                y: ui.y,
                pageIndex: pageIndex // Store the page index
            };
            return updatedInputFields;
        });
    };
    

    const handleSendPositions = async () => {
        setIsSendLoading(true);
        try {

            const positions = result.map((res)=> (
                {
                    id: res.id,
                    x: res.x,
                    y: res.y,
                    ref: tempRef,
                    value: res.value,
                    page: res.page,
                    type: res.type

                }
            ));
    
            // Make a POST request to send input field positions to the backend
            await axios.patch(`${DOMAIN_NAME}/pdf/${user.id}/pdfs/${id}/positions`, positions, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const title = "Envelope Sent!"
            const description = "The recipient will recieve a mail shortly"
            SuccessToast(title, description)
            // console.log('Positions sent successfully');
        } catch (error) {
            const title = "Oops"
            const description = "An error occured while trying to update the user inputs"
            ErrorToast()
            console.error('Error sending positions:', error);
        }
    };

    // Input related Functions
    const addText = () => {
        //Flag to change cursor if text
        setIsText(true);
        document.getElementById("drawArea").addEventListener("click", (e) => {
          e.preventDefault();
          setResult(result => [...result, {id:generateKey(e.pageX), x: e.pageX, y: e.pageY -10, text: "", page: pageNumber, type: "text", ref: tempRef}]);
        }, { once: true });
    }

    console.log("result", result);

    const onTextChange = (id, txt, ref) => {
        let indx = result.findIndex(x => x.id === id);
        let item = {...result[indx]};
        item.value = txt;
        item.ref = ref;
        result[indx] = item;
        setResult(result);
      }

    // Functions to handle page changes
    const changePage = (offset) => {
        // if(pageNumber >0 || pageNumber > numPages)
        setPageNumber(prevPageNumber => prevPageNumber+offset)
    }
    const nextPage = () => {
        changePage(1);
    }

    const prevPage = () => {
        changePage(-1);
    }

    const generateKey = (pre) => {
        return `${ pre }_${ new Date().getTime() }`;
      }

      const getPaths = (el) => {
        setResult(res => [...res,el]);
    }
    const resetButtonType = () => {
        setButtonType("");
      }
    
    const changeFlag = () => {
        setFlag("");
      }

      const getBounds = (obj) =>{
        setBounds(obj);
      }


    return (
        <>
            {
            result.map((res) => {
                if(res.type === "text")
                {
                let isShowing = "hidden";
                if(res.page === pageNumber)
                {
                    isShowing = "visible";
                }
                return(
                    <AutoTextArea key = {res.id} unique_key = {res.id} val = {res.value} onTextChange = {onTextChange} style = {{visibility: isShowing, color: "red" ,fontWeight:'normal', fontSize: 16, zIndex:20, position: "absolute", left: res.x+'px', top: res.y +'px'}}></AutoTextArea>
                    //<h1 key={index} style = {{textAlign: "justify",color: "red" ,fontWeight:'normal',width: 200, height: 80,fontSize: 33+'px', fontSize: 16, zIndex:10, position: "absolute", left: res.x+'px', top: res.y +'px'}}>{res.text}</h1>
                )
                }
                else
                {
                return(null);
                }
            })
            }
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
                    <Sidebar handleAddInputField = {addText}>
                        <Flex
                            p="12px"
                            justify="space-between"
                            bg="grey"
                            maxH={"4em"}
                        >
                            <Button
                                colorScheme='twitter'
                                rightIcon={<FaDownload />}
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                            <Box>
                                <IconButton 
                                    icon={<FaArrowLeft />}
                                    onClick={prevPage}
                                    isDisabled = {pageNumber === 1?true: false}
                                />
                                <Text mx= "1em" display={"inline-block"}>{pageNumber} of {numPages}</Text>
                                <IconButton 
                                    icon={<FaArrowRight/>}
                                    onClick={nextPage}
                                    isDisabled = {pageNumber === numPages?true: false}
                                />
                            </Box>
                            <Button colorScheme='green' onClick={handleSendPositions} isLoading= {isSendLoading}>Send</Button>
                            {/* <Button onClick={handleAddInputField}>Add Input</Button> Button to add input field */}
                        </Flex>
                        <Flex
                            bg="#00000099"
                            display="flex"
                            justifyContent="center"
                            userSelect="none"
                            alignItems="center"
                        >
                            <Document
                                file={`${DOMAIN_NAME}/pdf/${user.id}/pdfs/${id}`}
                                onLoadSuccess={handleDocumentLoadSuccess}
                            >
                                    <DrawArea getPaths = {getPaths} page = {pageNumber} flag = {flag} getBounds = {getBounds} changeFlag = {changeFlag} cursor = {isText ? "text": "default"} buttonType = {buttonType} resetButtonType = {resetButtonType}>
                                        <Page  pageNumber={pageNumber} className={"page"} />
                                    </DrawArea>
                            </Document>
                        </Flex>
                    </Sidebar>
                )
            }
        </>
    );
};

export default ViewPdf;