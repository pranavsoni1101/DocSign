import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Chakra UI imports
import {
    Container, Avatar, Heading,
    Box, Text, Button,
    useToast, Spinner, Grid,
    GridItem, VStack, Flex,
    IconButton, Tooltip, Stack,
    Spacer, ButtonGroup, Link,
    FormControl, Input, FormLabel,
    HStack
} from '@chakra-ui/react';

// Icon Imports
import { FaFilePdf, FaSave } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { MdCall, MdClose, MdDelete, MdUpload } from "react-icons/md";
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
import Cookies from 'js-cookie';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';


const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;
const Profile = () => {
    const countUpRef = useRef(null)
    const navigate = useNavigate();
    const [pfp, setPfp] = useState(null);
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isCounting, setIsCounting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [usersLoading, setUsersLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureName, setProfilePictureName] = useState(null);
    const [newUploadedPicture, setNewUploadedPicture] = useState(null);
    const [newUploadedPictureName, setNewUploadedPictureName] = useState(null);

    // State to manage the pdfs that are uploaded by the individual user
    const [uploadedPdfs, setUploadedPdfs] = useState([]);
    const [uploadedPdfsLoading, setUploadedPdfsLoading] = useState(true);

    // State to manage the pdfs that are pending by the user to sign
    const [pendingPdfs, setPendingPdfs] = useState([]);
    const [pendingPdfsLoading, setPendingPdfsLoading] = useState(true);

    useEffect(() => {
        setIsCounting(true);
        fetchUserDetails(navigate, setUser, setUsersLoading);
        // if(user)
        // fetchUploadedPDFs(setUploadedPdfs, setUploadedPdfsLoading, user);
    }, [navigate]);

    useEffect(() => {
        if (user) { // Check if user state is not null
            fetchPendingToBeSignedPdfs(setPendingPdfs, setPendingPdfsLoading);

            fetchUploadedPDFs(setUploadedPdfs, setUploadedPdfsLoading, user);
            fetchUserPfp();
            setName(user.name);
            setAddress(user.address);
            setPhone(user.phone);
            setProfilePicture(user.profilePicture)
        }
    }, [user]);

    const fetchUserPfp = async () => {
        try {
            const jwt = Cookies.get("jwt")
            const response = await axios.get(`${DOMAIN_NAME}/pfp`, {
                headers: {
                    'Authorization': `Bearer ${jwt} ` // Pass the user ID in the Authorization header
                }
            })
            setPfp(response.data);
        }
        catch (error) {
            console.log("Error occured", error);
        }
    }

    const handleUpdateUserDetails = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('profilePicture', profilePicture); // Append the base64 data
        formData.append('profilePictureName', profilePictureName); // Append the image name

        const token = Cookies.get("jwt")

        axios.patch(`${DOMAIN_NAME}/auth/user`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // Pass the user ID in the Authorization header
            }
        })
            .then(response => {
                setIsEditing(false);
                const {token} = response.data;
                Cookies.set('jwt', token); // Using js-cookie library
                const title = "Details Updated!";
                const description = "That's great your details have been saved"
                SuccessToast(title, description);
                fetchUserDetails(navigate, setUser, setUsersLoading);
            })
            .catch(err => {
                console.log("Error updating", err);
                const title = "OOPS Details not updated";
                const description = "Error updating your personal details";
                ErrorToast(title, description);
            });
    };


    const handleProfilePictureUpload = (event) => {
        const file = event.target.files[0];
        setProfilePicture(file);
        setNewUploadedPicture(URL.createObjectURL(file));
        setProfilePictureName(file.name);
        setNewUploadedPictureName(file.name);
    };

    const isLoading = usersLoading || pendingPdfsLoading || uploadedPdfsLoading;

    const uploadedPdfsLength = uploadedPdfs.length;
    const pendingToSignPdfLength = pendingPdfs.length;
    const rejectedPdfLength = pendingPdfs.reduce((count, obj) => {
        return count + (obj.rejected ? 1 : 0);
      }, 0);
          // const rejectedPdfsLength = 

    return (
        <>
            {isLoading ? (
                <Spinner
                    // m = "0 auto "
                    position="fixed"
                    top="50%"
                    left="50%"
                    size="xl"
                    transform="translate(-50%, -50%)"
                />
            ) : (
                <>
                    <Navbar />
                    <Container maxW="100%" p="2em" bgColor="gray.100">
                        <Grid
                            templateColumns="repeat(12, 1fr)"
                            gap={4}
                        >
                            <GridItem
                                colSpan={[12, 12, 12, 4, 3]}
                            >
                                <VStack
                                    p="1em"
                                    gap={5}
                                    borderRadius="xl"
                                    bgColor="primary.700"
                                    color="gray.100"
                                    boxShadow="2xl"
                                >
                                    {/* <Tooltip 
                                    hasArrow
                                    label="Click to Edit Profile" 
                                    placement='top'
                                > */}
                                    {pfp && pfp.profilePicture && pfp.profilePicture !== "null" ?
                                        <Avatar
                                            position="relative"
                                            borderRadius="full"
                                            // border= "2px solid"
                                            // borderColor= "teal"
                                            boxSize={["5em", "10em", "15em"]}
                                            src={`data:image/png;base64,${pfp.profilePicture}`}
                                            _hover={{
                                                cursor: "pointer",
                                                boxShadow: "2xl"
                                            }}
                                        />
                                        :
                                        <Avatar
                                            bg="teal"
                                            boxSize="xs"
                                        />
                                    }
                                    {/* </Tooltip> */}
                                    {isEditing ?
                                        <>
                                            <form onSubmit={handleUpdateUserDetails}>
                                                <Stack
                                                    // w = "100%"
                                                    p="0"
                                                    gap={2}
                                                >
                                                    <IconButton
                                                        w="fit-content"
                                                        // float= "right"
                                                        alignSelf="flex-end"
                                                        colorScheme='red'
                                                        icon={<IoMdClose />}
                                                        onClick={() => { setIsEditing(false); setNewUploadedPicture(null) }}
                                                    />
                                                    {/* <Box> */}
                                                            <FormControl>
                                                                <FormLabel>Profile Picture</FormLabel>
                                                        <HStack
                                                            justify= "space-evenly"
                                                            align={"center"}
                                                        >
                                                                <Box

                                                                    position="relative"
                                                                    // display="inline-block"
                                                                >
                                                                    <IconButton
                                                                        // w = "100%"
                                                                        position="relative"
                                                                        cursor="pointer"
                                                                        icon={<MdUpload />}
                                                                    />
                                                                    <Tooltip hasArrow label="Upload File" placement='auto'>
                                                                        <Input
                                                                            w="2.6em"
                                                                            opacity={0}     
                                                                            cursor="pointer"
                                                                            position= "absolute"
                                                                            left= {0}
                                                                            type='file'
                                                                            bg="white"
                                                                            color="gray.600"
                                                                            accept='image/*'
                                                                            zIndex={2}
                                                                            aria-hidden = "true"
                                                                            onChange={handleProfilePictureUpload}
                                                                            style = {{title: ' '}}
                                                                        />
                                                                    </Tooltip>
                                                                </Box>
                                                                <Spacer />
                                                                {newUploadedPicture &&
                                                                    <Box
                                                                        position="relative"
                                                                        // display="inline-block"
                                                                        >
                                                                        <Avatar
                                                                            ml="12px"
                                                                            src={newUploadedPicture}
                                                                        />
                                                                        <IconButton 
                                                                            position= "absolute"
                                                                            // right={0}
                                                                            onClick={() => setNewUploadedPicture(null)}
                                                                            borderRadius= "full"
                                                                            size="16px"
                                                                            colorScheme='red'
                                                                            icon={<MdClose />}
                                                                        />
                                                                        <Text fontSize="xs" wordBreak={"12px"}>{newUploadedPictureName}</Text>
                                                                    </Box>
                                                                }
                                                            </HStack>
                                                            </FormControl>
                                                    {/* </Box> */}
                                                    <FormControl>
                                                        <FormLabel>Name</FormLabel>
                                                        <Input
                                                            // w = "100%"
                                                            bg="white"
                                                            color="gray.600"
                                                            placeholder='John Doe'
                                                            w="100%"
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
                                                            bg="white"
                                                            color="gray.600"
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
                                                            bg="white"
                                                            color="gray.600"
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
                                                        rightIcon={<FaSave />}
                                                        type='submit'
                                                    >
                                                        Save
                                                    </Button>
                                                </Stack>
                                            </form>
                                        </>
                                        :
                                        <>
                                            <Heading
                                                as="h4"
                                                size="md"
                                                textAlign="start"
                                            >
                                                {user.name}
                                            </Heading>
                                            <Button
                                                w="full"
                                                // variant="outline"
                                                colorScheme='orange'
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Edit Profile
                                            </Button>
                                            <Flex
                                                justify="space-between"
                                            >
                                                <Text
                                                    display="inline-block"
                                                    fontSize="2xl"
                                                >
                                                    <CiLocationOn />
                                                </Text>
                                                <Text
                                                    display="inline-block"
                                                >
                                                    {user.address}
                                                </Text>
                                            </Flex>
                                            <Flex
                                                // w = "10em"
                                                direction="row"
                                                alignItems="start"
                                                justify="start"
                                                justifyContent="start"
                                            >
                                                <Text
                                                    // display="inline-block"
                                                    fontSize="2xl"
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
                                colSpan={[12, 12, 12, 8, 9]}
                                overflowY="auto"
                                sx={{
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
                                    w="100%"
                                    p="2em"
                                    bgColor="primary.700"
                                    boxShadow="lg"
                                    borderRadius="xl"
                                >
                                    <Heading
                                        textAlign="center"
                                        letterSpacing="1px"
                                        textTransform="uppercase"
                                        color="white"
                                    >
                                        Doc
                                        <Text as="span" color={"#ec7507"}>
                                            -O-
                                        </Text>
                                        Meter
                                    </Heading>
                                    <Stack
                                        w="100%"
                                        mt="1em"
                                        direction={{ base: "column", md: "row" }}
                                    >
                                        <Box
                                            p="1em"
                                            w="100%"
                                            borderRadius="md"
                                            border="1px solid"
                                            textTransform="uppercase"
                                            // color="primary.500"
                                            // bg = "primary.100"
                                            // borderColor="primary.400"
                                            color="orange.500"
                                            borderColor="orange.500"
                                        >
                                            <Text
                                                fontSize="1.4em"
                                                textAlign="center"
                                                fontWeight="bold"
                                            >
                                                Uploaded Docs
                                            </Text>
                                            <Text
                                                fontSize="2em"
                                                fontWeight="bold"
                                                textAlign="center"
                                            >
                                                <CountUp
                                                    start={isCounting ? 0 : null}
                                                    end={uploadedPdfsLength}
                                                    duration={5}
                                                >
                                                    <span ref={countUpRef} />
                                                </CountUp>
                                            </Text>
                                        </Box>
                                        <Box
                                            p="1em"
                                            w="100%"
                                            borderRadius="md"
                                            border="1px solid"
                                            textTransform="uppercase"
                                            color="gray.100"
                                            borderColor="gray.100"
                                        // color="gray.400"
                                        // borderColor="gray.400"
                                        >
                                            <Text
                                                fontSize="1.4em"
                                                textAlign="center"
                                                fontWeight="bold"
                                            >
                                                Pending Docs
                                            </Text>
                                            <Text
                                                fontSize="2em"
                                                fontWeight="bold"
                                                textAlign="center"
                                                color="gray.100"
                                            >
                                                <CountUp
                                                    start={isCounting ? 0 : null}
                                                    end={pendingToSignPdfLength}
                                                    duration={5}
                                                >
                                                    <span ref={countUpRef} />
                                                </CountUp>
                                            </Text>
                                        </Box>
                                        <Box
                                            p="1em"
                                            w="100%"
                                            borderRadius="md"
                                            border="1px solid"
                                            color="orange.500"
                                            borderColor="orange.500"
                                        // bg = "primary.100"

                                        // borderColor="primary.400"
                                        // color="primary.500"
                                        >
                                            <Text
                                                textAlign="center"
                                                textTransform="uppercase"
                                                fontWeight="bold"
                                                fontSize="1.4em"
                                            >
                                                Rejected Docs
                                            </Text>
                                            <Text
                                                fontSize="2em"
                                                fontWeight="bold"
                                                textAlign="center"
                                                color="orange.500"
                                            >
                                                <CountUp
                                                    start={isCounting ? 0 : null}
                                                    end={rejectedPdfLength}
                                                    duration={5}
                                                >
                                                    <span ref={countUpRef} />
                                                </CountUp>
                                            </Text>
                                        </Box>
                                    </Stack>
                                </Box>
                                <Box
                                    p={["16px", "2em"]}
                                    mt="1em"
                                    bgColor="cyan.700"
                                    boxShadow="md"
                                    borderRadius="xl"
                                >
                                    <Heading
                                        textTransform="uppercase"
                                        color="white"
                                    >
                                        Here's the uploaded PDFS
                                    </Heading>
                                    <Stack
                                        w="100%"
                                    >
                                        <Flex
                                            p="12px"
                                            boxShadow="lg"
                                            borderRadius="2xl"
                                            backgroundColor="primary.100"
                                            align={"center"}
                                            justify={"space-between"}
                                            wrap="wrap"
                                        >
                                            <Text
                                                w="sm"
                                                as="h3"
                                                fontSize="lg"
                                                fontWeight="bold"
                                            >
                                                Ready to sprinkle some digital magic on those documents?
                                                Let's seal the deal! Create an envelope now!
                                            </Text>
                                            {/* <Spacer /> */}
                                            <Button
                                                as={Link}
                                                href='/createEnvelope'
                                                colorScheme='primary'
                                                // backgroundColor="primary.500"
                                                leftIcon={<FaEnvelopeOpenText />}
                                                transition="all 0.5s ease-in-out"
                                                _hover={{
                                                    // color: "primary.500",
                                                    // backgroundColor: "gray.500",
                                                    textDecoration: "none"
                                                }}
                                            >
                                                Envelope
                                            </Button>
                                        </Flex>
                                        {uploadedPdfs.length !== 0 ? uploadedPdfs.map((pdf) => (
                                            <Flex
                                                p="12px"
                                                key={pdf._id}
                                                boxShadow="lg"
                                                borderRadius="2xl"
                                                color={"white"}
                                                backgroundColor="primary.500"
                                                align={"center"}
                                                justify={"space-between"}
                                                wrap={"wrap"}
                                            >
                                                <Box>
                                                    <FaFilePdf />
                                                    <Text
                                                        fontWeight="600"
                                                    >
                                                        {pdf.fileName}
                                                    </Text>
                                                    <Text
                                                        fontWeight="600"
                                                    >
                                                        {pdf.size} bytes
                                                    </Text>
                                                    <Text
                                                        fontWeight="600"
                                                    >
                                                        Uploaded At: {formatDateFromISO(pdf.uploadedAt)}
                                                    </Text>
                                                </Box>
                                                {/* <Spacer /> */}
                                                <Stack
                                                    direction={{ base: "column", md: "row" }}
                                                >
                                                    <Button
                                                        as={Link}
                                                        href={`/pdf/${pdf._id}/${pdf.fileName}/`}
                                                        // ml="12px"

                                                        colorScheme='orange'
                                                        // backgroundColor="gray.500"
                                                        // color="primary.500"
                                                        // transition="all 0.5s ease-in-out"
                                                        _hover={{
                                                            textDecoration: "none",
                                                            // backgroundColor: "gray.100",
                                                            // color: "black"
                                                        }}
                                                    >
                                                        View & Edit
                                                    </Button>
                                                    <IconButton
                                                        colorScheme='red'
                                                        onClick={() => handleDeleteUploadedPdf(pdf._id, user, setUploadedPdfs, setUploadedPdfsLoading, setPendingPdfs, setPendingPdfsLoading)}
                                                    >
                                                        <MdDelete />
                                                    </IconButton>
                                                </Stack>
                                            </Flex>
                                        ))
                                            :
                                            <Flex
                                                p="12px"
                                                boxShadow="lg"
                                                borderRadius="2xl"
                                                backgroundColor="primary.500"
                                            >
                                                <Text
                                                    as="h3"
                                                    w="md"
                                                    fontSize="lg"
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
                                    p={["16px", "2em"]}
                                    mt="1em"
                                    bgColor="cyan.700"
                                    borderRadius="xl"
                                >
                                    <Heading
                                        textTransform="uppercase"
                                        color="white"
                                    >
                                        Pending to Sign
                                    </Heading>
                                    <Stack
                                        w="100%"
                                    >
                                        <Flex
                                            p="12px"
                                            boxShadow="lg"
                                            borderRadius="lg"
                                            backgroundColor="primary.100"
                                        >
                                            <Text
                                                w={["100%", "100%", "sm"]}
                                                as="h3"
                                                fontSize="lg"
                                                fontWeight="bold"
                                            >
                                                Welcome to the Unfinished Symphony:
                                                Where Important Docs Await Your Signature!
                                            </Text>
                                        </Flex>
                                        {pendingPdfs.map((file, index) => (
                                            <Flex
                                                p="12px"
                                                key={file._id}
                                                boxShadow="lg"
                                                borderRadius="2xl"
                                                backgroundColor="primary.500"
                                                color="white"
                                                align="center"
                                                justify={"space-between"}
                                                wrap="wrap"
                                            >
                                                <Box>
                                                    <Text
                                                        fontWeight="600"
                                                    >
                                                        <FaFilePdf />
                                                        {file.fileName}
                                                    </Text>
                                                    {file.expiryDate !== null ? (
                                                        <Text>
                                                            <strong>Expiry Date: </strong>
                                                            {formatDateFromISO(file.expiryDate)}
                                                        </Text>
                                                    ) : (
                                                        <Text>
                                                            Fear not, for this doc has an eternal life - it'll never expire!
                                                        </Text>
                                                    )}
                                                </Box>
                                                {/* <Spacer /> */}
                                                <Stack
                                                    direction={{ base: "column", md: "row" }}
                                                    spacing={2}
                                                >

                                                    {(file.accepted || file.delayed) && !file.signed && (
                                                        <Button
                                                            as={Link}
                                                            href={`/sign/${file._id}/${file.fileName}`}
                                                            colorScheme='whatsapp'
                                                            _hover={{
                                                                textDecoration: "none",
                                                            }}
                                                        >
                                                            Sign
                                                        </Button>
                                                    )}
                                                    {file.rejected && (
                                                        <Text>PDF is rejected and cannot be accessed.</Text>
                                                    )}
                                                    {(!file.accepted && !file.delayed && !file.rejected) && (
                                                        <>
                                                            <Button
                                                                colorScheme="green"
                                                                onClick={() => handleAcceptToSignPdf(file._id, setPendingPdfs, setPendingPdfsLoading)}
                                                            >
                                                                Accept to Sign
                                                            </Button>
                                                            <Button
                                                                colorScheme="yellow"
                                                                onClick={() => handleDelayToSignPdf(file._id, setPendingPdfs, setPendingPdfsLoading)}
                                                            >
                                                                Delay In Signing
                                                            </Button>
                                                            <Button
                                                                as={Link}
                                                                href={`/sign/${file._id}/${file.fileName}`}
                                                            >
                                                                Sign
                                                            </Button>
                                                            <Button
                                                                colorScheme="red"
                                                                onClick={() => handleRejectToSignPdf(file._id, setPendingPdfs, setPendingPdfsLoading)}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </Stack>
                                            </Flex>
                                        ))}
                                    </Stack>
                                </Box>

                            </GridItem>
                        </Grid>
                    </Container>
                    <Footer />
                </>
            )}
        </>
    );
};

export default Profile;
