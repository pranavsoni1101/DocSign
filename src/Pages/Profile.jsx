import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Chakra UI imports
import { Container, Image, Heading, 
         Box, Text, Button, 
         useToast, Spinner, Grid, 
         GridItem, VStack, Flex, 
         IconButton, Tooltip, Stack,
         Spacer, ButtonGroup, Link, FormControl, Input, FormLabel
} from '@chakra-ui/react';

// Icon Imports
import { FaFilePdf,FaSave } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { MdCall,MdDelete } from "react-icons/md";
import { FaEnvelopeOpenText } from "react-icons/fa";


// Built Comoponents/Functions
import fetchUserDetails from '../../utils/fetchUser';
import formatDateFromISO from '../../utils/formatDateFromIso';
import { fetchPendingToBeSignedPdfs } from '../../utils/pendingPdf';
import { fetchUploadedPDFs, handleDeleteUploadedPdf } from '../../utils/uploadedPdfs';
import { handleAcceptToSignPdf, handleDelayToSignPdf, handleRejectToSignPdf } from '../../utils/pendingPdf';
import CountUp from 'react-countup';
import { IoMdClose } from 'react-icons/io';
import SuccessToast from '../../components/Toasts/SuccessToast';
import ErrorToast from '../../components/Toasts/ErrorToast';


const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;
const Profile = () => {
    const toast = useToast();
    const countUpRef = useRef(null)
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isCounting, setIsCounting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [usersLoading, setUsersLoading] =  useState(true);
    const [profilePicture, setProfilePicture]  = useState(null);

    // State to manage the pdfs that are uploaded by the individual user
    const [uploadedPdfs, setUploadedPdfs] = useState([]);
    const [uploadedPdfsLoading, setUploadedPdfsLoading] = useState(true);

    // State to manage the pdfs that are pending by the user to sign
    const [pendingPdfs, setPendingPdfs] = useState([]);
    const [pendingPdfsLoading, setPendingPdfsLoading] = useState(true);

    useEffect(() => {
        setIsCounting(true);
        fetchUserDetails(navigate, setUser, setUsersLoading);
        fetchPendingToBeSignedPdfs(setPendingPdfs, setPendingPdfsLoading);
        // if(user)
            // fetchUploadedPDFs(setUploadedPdfs, setUploadedPdfsLoading, user);
    }, [navigate]);

    useEffect(() => {
        if (user) { // Check if user state is not null
            fetchUploadedPDFs(setUploadedPdfs, setUploadedPdfsLoading, user);
            setName(user.name);
            setAddress(user.address);
            setPhone(user.phone);
        }
    }, [user]); 

    const handleUpdateUserDetails = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('profilePicture', profilePicture); // Assuming profilePicture is a file object
        
        const token = sessionStorage.getItem("token");

        axios.patch(`${DOMAIN_NAME}/auth/user`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // Pass the user ID in the Authorization header
            }
        })
            .then(response => {
                console.log('Updated successfully');
                setIsEditing(false);
                const title = "Details Updated!";
                const description = "That's great your details have been saved"
                SuccessToast(title, description);
                // toast({
                //     title: ,
                //     description: ,
                //     status: "success",
                //     variant: "left-accent",
                //     position: "top",
                //     duration: 9000,
                //     isClosable: true
                // });
                fetchUserDetails(navigate, setUser, setUsersLoading);
            })
            .catch(err => {
                console.log("Error updating", err);
                const title = "OOPS Details not updated";
                const description = "Error updating your personal details";
                ErrorToast()
                // toast({
                //     position: "top",
                //     variant: "left-accent",
                //     title: ,
                //     description: ,
                //     status: "error",
                //     duration: 9000,
                //     isClosable: true
                // });
            });
    };
    

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setProfilePicture(file);
    };

    const isLoading = usersLoading || pendingPdfsLoading || uploadedPdfsLoading;

    const uploadedPdfsLength = uploadedPdfs.length;
    console.log("uploadd", uploadedPdfsLength);
    const pendingToSignPdfLength = pendingPdfs.length;

    return (
        <>
            {isLoading  ? (
                <Spinner 
                    // m = "0 auto "
                    position= "fixed"
                    top= "50%"
                    left= "50%"
                    size = "xl"
                    transform= "translate(-50%, -50%)"
                />
            ) : (
                <Container maxW="100%" p= "2em" mt = "1.8em">
                    <Grid
                        templateColumns = "repeat(12, 1fr)"
                        gap={4}
                    >
                        <GridItem
                            colSpan={3}
                        >
                            <VStack
                                p = "1em"
                                gap={5}
                                borderRadius= "xl"
                                bgColor= "gray.500"
                                color= "gray.100"
                                boxShadow= "2xl"
                            >
                                <Tooltip 
                                    hasArrow
                                    label="Click to Edit Profile" 
                                    placement='top'
                                >
                                    <Image 
                                        position="relative"
                                        borderRadius= "full"
                                        border= "2px solid"
                                        borderColor= "primary.500"
                                        boxSize= "xs"
                                        src='https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                        _hover={{
                                            cursor: "pointer",
                                            boxShadow: "2xl"
                                        }}
                                    />
                                </Tooltip>
                                {isEditing? 
                                    <>
                                        <form onSubmit={handleUpdateUserDetails}>
                                            <Stack
                                                w = "100%"
                                                p = "0"
                                                gap = {2}
                                            >
                                                <IconButton 
                                                    w = "fit-content"
                                                    alignSelf="flex-end"
                                                    icon={<IoMdClose />}
                                                    onClick={() => setIsEditing(false)}
                                                />
                                                <FormControl>
                                                    <FormLabel>Name</FormLabel>
                                                    <Input 
                                                        bg = "gray.100"
                                                        color = "gray.600"
                                                        placeholder='John Doe'
                                                        w = "100%"
                                                        // borderColor= "primary.200"
                                                        value={name}
                                                        onChange={(event) => setName(event.target.value)}
                                                        focusBorderColor='primary.500'
                                                        _placeholder={{
                                                            color: "gray.500"
                                                        }}
                                                        _hover={{
                                                            borderColor: "primary.500"
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Address</FormLabel>
                                                    <Input 
                                                        bg = "gray.100"
                                                        color = "gray.600"
                                                        placeholder='Enter your Address..'
                                                        // borderColor= "primary.200"
                                                        value={address}
                                                        onChange={(event) => setAddress(event.target.value)}
                                                        focusBorderColor='primary.500'
                                                        _placeholder={{
                                                            color: "gray.500"
                                                        }}
                                                        _hover={{
                                                            borderColor: "primary.500"
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Contact</FormLabel>
                                                    <Input 
                                                        bg = "gray.100"
                                                        color = "gray.600"
                                                        placeholder='+91xxxxx-xxxxx'
                                                        // borderColor= "primary.200"
                                                        value={phone}
                                                        onChange={(event) => setPhone(event.target.value)}
                                                        focusBorderColor='primary.500'
                                                        _placeholder={{
                                                            color: "gray.500"
                                                        }}
                                                        _hover={{
                                                            borderColor: "primary.500"
                                                        }}
                                                    />
                                                </FormControl>
                                                <Button
                                                    colorScheme='green'
                                                    rightIcon={<FaSave/>}
                                                    type='submit'
                                                >
                                                    Save
                                                </Button>
                                            </Stack>
                                        </form>
                                    </>
                                    :
                                    <>
                                        <Text>{user.name}</Text>
                                        {/* <Text>{user.name}</Text> */}
                                        <Button
                                            w = "xs"
                                            variant= "outline"
                                            colorScheme='primary'
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit Profile
                                        </Button>
                                        <Flex
                                            justify= "space-between"
                                        >
                                            <Text
                                                display="inline-block"
                                                fontSize= "2xl"
                                            >
                                                <CiLocationOn />
                                            </Text>
                                            <Text
                                                display= "inline-block"
                                            >
                                                {user.address}
                                            </Text>
                                        </Flex>
                                        <Flex
                                            // w = "10em"
                                            direction= "row"
                                            alignItems= "center"
                                            justifyContent= "space-between"
                                        >
                                            <Text
                                                // display="inline-block"
                                                fontSize= "2xl"
                                            >
                                                <MdCall />
                                            </Text>

                                            <Text
                                                // display= "inline-block"
                                            >
                                                {user.phone}
                                            </Text>
                                        </Flex>
                                    </>
                                }
                            </VStack>
                        </GridItem>
                        <GridItem
                            colSpan={9}
                            overflowY= "auto"
                            sx = {{
                                '&::-webkit-scrollbar': {
                                    h: "5px",
                                    mr: "3px",
                                    width: "8px"
                                },
                                '&::-webkit-scrollbar-track': {
                                    padding: "2px",
                                    background: "gray.600",
                                    borderRadius: '24px',

                                    // width: '6px',
                                  },
                                  '&::-webkit-scrollbar-thumb': {
                                    background: "primary.600",
                                    borderRadius: '24px',
                                  },
                            }}
                        >
                            <Box
                                w = "100%"
                                // h = '100%'
                                p = "2em"
                                color= "gray.100"
                                bgColor= "gray.500"
                                // boxShadow= "2xl"
                                borderRadius= "xl"
                            >
                                <Heading
                                    textAlign= "center"
                                    letterSpacing= "1px"
                                    textTransform= "uppercase"
                                >
                                    Doc
                                    <Text as="span" color={"primary.500"}>
                                        -O-
                                    </Text>
                                    Meter
                                </Heading>
                                <Stack 
                                    w= "100%"
                                    mt = "1em"
                                    direction="row" 
                                >
                                    <Box
                                        p = "1em"
                                        w = "100%"
                                        borderRadius= "md"
                                        border="1px solid"
                                        textTransform= "uppercase"
                                        color= "primary.500"
                                        borderColor="primary.400"
                                    >
                                        <Text
                                            fontSize="1.4em"
                                            textAlign= "center"
                                            fontWeight= "bold"
                                        >
                                            Uploaded Docs
                                        </Text>
                                            <Text
                                                fontSize="2em"
                                                fontWeight= "bold"
                                                textAlign="center"
                                            >
                                        <CountUp
                                            start={isCounting ? 0 : null}
                                            end = {uploadedPdfsLength}
                                            duration={5}
                                        >
                                                <span ref={countUpRef}/>
                                        </CountUp>
                                            </Text>
                                    </Box>
                                    <Box
                                        p = "1em"
                                        w = "100%"
                                        borderRadius= "md"
                                        border="1px solid"
                                        textTransform= "uppercase"
                                        color= "gray.100"
                                        borderColor="gray.100"
                                    >
                                        <Text
                                            fontSize="1.4em"
                                            textAlign= "center"
                                            fontWeight= "bold"
                                        >
                                            Pending Docs
                                        </Text>
                                            <Text
                                                fontSize="2em"
                                                fontWeight= "bold"
                                                textAlign="center"
                                                color= "primary.500"
                                            >
                                        <CountUp
                                            start={isCounting ? 0 : null}
                                            end = {pendingToSignPdfLength}
                                            duration={5}
                                        >
                                                <span ref={countUpRef}/>
                                        </CountUp>
                                            </Text>
                                    </Box>
                                    <Box
                                        p = "1em"
                                        w = "100%"
                                        borderRadius= "md"
                                        border="1px solid"
                                        borderColor="primary.400"
                                        color= "primary.500"
                                    >
                                        <Text
                                            textAlign= "center"
                                            textTransform= "uppercase"
                                            fontWeight= "bold"
                                            fontSize= "1.4em"
                                        >
                                            Heheh
                                        </Text>
                                    </Box>
                                </Stack>
                            </Box>
                            <Box
                                p = "2em"
                                // h = "100%"
                                mt = "1em"
                                bgColor= "gray.500"
                                borderRadius= "xl"
                            >
                                <Heading
                                    textTransform= "uppercase"
                                    color= "gray.100"
                                >
                                    Here's the uploaded PDFS
                                </Heading>
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
                                        Ready to sprinkle some digital magic on those documents? 
                                        Let's seal the deal! Create an envelope now!
                                    </Text>
                                    <Spacer/>
                                    <Button
                                        as={Link}
                                        href='/createEnvelope'
                                        backgroundColor= "primary.500"
                                        leftIcon={<FaEnvelopeOpenText />}
                                        transition= "all 0.5s ease-in-out"
                                        _hover={{
                                            color: "primary.500",
                                            backgroundColor: "gray.500",
                                            textDecoration: "none"
                                        }}
                                    >
                                        Envelope
                                    </Button>
                                </Flex>
                                {uploadedPdfs.length !== 0? uploadedPdfs.map((pdf) => (
                                    <Flex
                                    p = "12px"
                                    key={pdf._id}
                                    boxShadow= "lg"
                                    borderRadius= "2xl"
                                    backgroundColor="primary.500"
                                >
                                    <Box>            
                                        <FaFilePdf />
                                        <Text
                                            fontWeight= "600"
                                        >
                                            {pdf.fileName}
                                        </Text>
                                        <Text
                                            fontWeight= "600"
                                        >
                                            {pdf.size} bytes
                                        </Text>
                                        <Text
                                            fontWeight= "600"
                                        >
                                            Uploaded At: {formatDateFromISO(pdf.uploadedAt)}
                                        </Text>
                                    </Box>
                                    <Spacer />
                                    <ButtonGroup>
                                            <Button
                                                as={Link}
                                                href={`/pdf/${pdf._id}/${pdf.fileName}/`}
                                                // ml="12px"
                                                backgroundColor = "gray.500"
                                                color = "primary.500"
                                                transition= "all 0.5s ease-in-out"
                                                _hover={{
                                                    textDecoration: "none",
                                                    backgroundColor: "gray.100",
                                                    color: "black"
                                                }}
                                            >
                                                View & Edit
                                            </Button>
                                            <IconButton
                                                colorScheme='red'
                                                onClick={() => handleDeleteUploadedPdf(pdf._id, user, setUploadedPdfs, setUploadedPdfsLoading)}
                                            >
                                                <MdDelete />
                                            </IconButton>
                                    </ButtonGroup>
                                </Flex>
                                ))
                                :
                                <Flex
                                        p = "12px"
                                        boxShadow= "lg"
                                        borderRadius= "2xl"
                                        backgroundColor="primary.500"
                                    >
                                    <Text
                                        as = "h3"
                                        w = "md"
                                        fontSize= "lg"
                                        fontWeight="bold"
                                    >
                                        Let's give those PDFs a digital home! 
                                        Time to create some envelopes and peek 
                                        inside for a whimsical view of your uploaded documents.
                                    </Text>                                
                                </Flex>
                            }
                                </Stack>
                            </Box>
                            <Box
                                p = "2em"
                                // h = "100%"
                                mt= "1em"
                                bgColor= "gray.500"
                                borderRadius= "xl"
                            >
                                <Heading
                                    textTransform= "uppercase"
                                    color= "gray.100"
                                >
                                    Pending to Sign
                                </Heading>
                                <Stack
                                w = "100%"
                            >
                                    <Flex
                                        p = "12px"
                                        boxShadow= "lg"
                                        borderRadius= "lg"
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
                                    {
                                        pendingPdfs.map((file, index)=> (
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
                                                onClick={() => handleAcceptToSignPdf(file._id)}
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
                                                onClick={() =>handleDelayToSignPdf(file._id)}
                                            >
                                                Delay In Signing
                                            </Button>
                                            <Button 
                                                colorScheme='red'
                                                onClick={() => handleRejectToSignPdf(file._id)}
                                            >
                                                Reject
                                            </Button>    
                                        </ButtonGroup>
                                    </Flex>
                                        ))
                                    }
                                </Stack>
                            </Box>
                        </GridItem>
                    </Grid>
                </Container>
            )}
        </>
    );
};

export default Profile;
