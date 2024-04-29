import React, { useEffect, useState, useRef } from 'react';
import { Heading, Box, Button, Text, Flex, Input, Spinner, IconButton, position } from '@chakra-ui/react';
import { Page, Document, pdfjs } from 'react-pdf';
import { useNavigate, useParams } from 'react-router-dom';
import { FaDownload } from "react-icons/fa6";
import Draggable from 'react-draggable';
import axios from 'axios';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
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
import Cookies from 'js-cookie';
import ModifyPage from '../../components/ModifyPdf';

const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const SignPdf = () => {
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
    const [pdf, setPdf] = useState(null);
    const [pdfBytes, setPdfBytes] = useState(null)
    const [result, setResult] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [flag, setFlag] = useState("");
    const [buttonType, setButtonType] = useState("");
    const [isText, setIsText] = useState(false);
    const [bounds, setBounds] = useState({});

    const [isSubmuitClickable, setIsSubmitClickable] = useState(true);
    const tempRef = useRef(null);

    useEffect(()=> {
        fetchUserDetails(navigate, setUser, setUsersLoading);
    }, []);

    useEffect(() => {
        if(!usersLoading){
            fetchPdf();
        }
    }, [usersLoading])

    // useEffect(() => {
    //     console.log("Updated position:", inputFields);
    // }, [inputFields]);

    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1)
    };

    const handleDownload = async () => {
        try {
            const token = Cookies.get("jwt")
            const pdfBlob = await fetch(`${DOMAIN_NAME}/pdf/${user.id}/pdfs/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Pass the user ID in the Authorization header
                }
            }).then(res => res.blob());
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

    // Input related Functions
    const addText = () => {
        //Flag to change cursor if text
        setIsText(true);
        document.getElementById("drawArea").addEventListener("click", (e) => {
          e.preventDefault();
          setResult(result => [...result, {id:generateKey(e.pageX), x: e.pageX, y: e.pageY -10, value: "", page: pageNumber, type: "text"}]);
        }, { once: true });
    }

    // console.log("result", result);

    const onTextChange = (id, txt, ref) => {
        console.log("on text change trigyy wiggy");
        console.log("Inside text change this is the text: ", txt);
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

    const fetchPdf = async () => {
        try {
            const authToken= Cookies.get('jwt');
            const  response = await axios.get(`${DOMAIN_NAME}/pdf/pending/${id}/${user.email}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}` // Include the authorization token here
                }
            });
            setPdf(response.data);
            console.log("response ",response.data);
            setResult(response.data.inputFields);
            const pdfData = btoa(
                new Uint8Array(response.data.data.data)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            setPdfBytes(pdfData)
            console.log("response", response.data);
            
        } catch (error) {
            console.log("error", error);
        }
    }

    const handleSaveModifiedPdf = async (type) => {
        try {
            setIsSubmitClickable(false);
            const existingPdfBytes = pdfBytes;
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();
            const textSize = 16;
    
            result.forEach((res) => {
                if (res.type === "text" && res.ref && res.ref.current) {
                    pages[res.page - 1].drawText(res.value, {
                        x: res.ref.current.offsetLeft - bounds.x,
                        y: bounds.y - res.ref.current.offsetTop - 17,
                        size: textSize,
                        font: helveticaFont,
                        color: rgb(0, 0, 0),
                        maxWidth: res.ref.current.getBoundingClientRect().width,
                        lineHeight: 15
                    });
                }
                if (res.type === "freehand") {
                    const pathData = "M " +
                        res.arr.map(p => `${p.get('x')},${p.get('y')}`).join(" L ");
                    pages[res.page - 1].moveTo(0, pages[0].getHeight());
                    pages[res.page - 1].drawSvgPath(pathData, {
                        borderColor: rgb(0.95, 0.1, 0.1),
                    });
                }
            });
    
            const pdfBytes2 = await pdfDoc.save();
            console.log("This is pdf byteessssss in save modified pdf", pdfBytes2);
            const pdfBlob = new Blob([pdfBytes2], { type: 'application/pdf' });
    
                // Make a PATCH request to your backend API endpoint to save the modified PDF data
                console.log(`${DOMAIN_NAME}/pdf/${user.email}/pdfs/${pdf._id}`);
                const formData = new FormData();
                // formData.append('pdf', pdfBlob, pdf.fileName);
                formData.append('pdf', pdfBlob);
    
                const response = await axios.patch(`${DOMAIN_NAME}/pdf/${user.email}/pdfs/${pdf._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                console.log('Modified PDF saved successfully:', response);
                SuccessToast("Congratulations! You just signed", "The signature has been recorded and saved");
                navigate("/profile")
        } catch (error) {
            console.error('Error saving modified PDF:', error);
        }
    };
    
    const areAllTextEmpty = result.every(item => item.text === "");
    console.log(areAllTextEmpty);
    console.log("Results", result);

    return (
        <>
            {
            result.map((res) => {
                let isDisabled = user.email===res.user? false: true;
                if(res.type === "text")
                {
                let isShowing = "hidden";
                if(res.page === pageNumber)
                {
                    isShowing = "visible";
                }
                return(
                    <AutoTextArea key = {res.id} unique_key = {res.id}  user = {res.user} val = {res.value} onTextChange = {onTextChange} style = {{visibility: isShowing, color: "red" ,fontWeight:'normal', fontSize: 16, zIndex:20, position: "absolute", left:`calc(${res.x}px - 196px)`, top: `calc(${res.y}px - 16px)`}}></AutoTextArea>
                    //<h1 key={index} style = {{textAlign: "justify",color: "red" ,fontWeight:'normal',width: 200, height: 80,fontSize: 33+'px', fontSize: 16, zIndex:10, position: "absolute", left: res.x+'px', top: res.y +'px'}}>{res.value}</h1>
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
                        <>
                        {/* <Sidebar> */}
                        <Flex
                            p="12px"
                            justify="space-between"
                            bg="grey"
                            maxH={"4em"}
                        >
                            <Button
                                colorScheme='twitter'
                                rightIcon={<FaDownload />}
                                onClick={() => setButtonType("download")}
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
                            <Button colorScheme='green' isDisabled = {!isSubmuitClickable} onClick={() => handleSaveModifiedPdf()}>Submit</Button>
                            {/* <Button onClick={handleAddInputField}>Add Input</Button> Button to add input field */}
                        </Flex>
                        <Flex
                            bg="#00000099"
                            display="flex"
                            justifyContent="center"
                            userSelect="none"
                            alignItems="center"
                        >
                            {pdf &&
                            <Document
                                file={`data:application/pdf;base64,${pdfBytes}`}
                                onLoadSuccess={handleDocumentLoadSuccess}
                            >
                                {/* {Array.from(new Array(numPages), (el, index) => ( */}
                                    {/* <Box
                                        my="12px"
                                        // key={`page_${index + 1}`}
                                    > */}
                                    <DrawArea getPaths = {getPaths} page = {pageNumber} flag = {flag} getBounds = {getBounds} changeFlag = {changeFlag} cursor = {isText ? "text": "default"} buttonType = {buttonType} resetButtonType = {resetButtonType}>
                                        <Page  pageNumber={pageNumber} className={"page"} />
                                    </DrawArea>
                                        {/* Render input field if it exists for the current page */}
                                        {/* {inputFields && inputFields.map((inputField,inputIndex) => (
                                            <Draggable
                                            onDrag={(e, ui) => handleDrag(index, inputIndex, e, ui)}
                                            defaultPosition={{
                                                    x: inputField.x,
                                                    y: inputField.y
                                                }}
                                            >
                                                <Input
                                                    zIndex={2}
                                                    size="xs"
                                                    w="xs"
                                                    placeholder={`x: ${inputField.x} y: ${inputField.y} at ${index + 1} page`}
                                                    style={{
                                                        position: 'absolute',
                                                        left: inputField.x,
                                                        top: inputField.y
                                                    }}
                                                    value={inputField.value}
                                                    onChange={e =>
                                                        handleInputChange(index, e.target.value)
                                                    }
                                                />
                                            </Draggable>
                                        ))} */}
                                    {/* </Box> */}
                                {/* ))} */}
                            </Document>
}                                 <ModifyPage resetButtonType = {resetButtonType} buttonType = {buttonType} pdf = {pdfBytes} result = {result} bounds = {bounds} fileName = {pdf ? pdf.fileName : "document"}/>
                        </Flex>
                        {/* </Sidebar> */}
                </>
                )
            }
        </>
    );
};

export default SignPdf;