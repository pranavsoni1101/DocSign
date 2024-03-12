import { Container, Image, Heading, Box, Text, Button, FormControl, Input, FormLabel, useToast, Spinner, Grid, GridItem, VStack, Flex, IconButton, Tooltip, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import fetchUserDetails from '../../utils/fetchUser';
import { useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import axios from 'axios';
import { CiLocationOn } from "react-icons/ci";
import { MdCall } from "react-icons/md";


const Profile = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [usersLoading, setUsersLoading] =  useState(true);
    const [profilePicture, setProfilePicture]  = useState(null);

    useEffect(() => {
        fetchUserDetails(navigate, setUser, setUsersLoading);
    }, []);

    const handleUpdate = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('profilePicture', profilePicture); // Assuming profilePicture is a file object
        
        const token = sessionStorage.getItem("token");

        axios.patch("http://localhost:3001/auth/user", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // Pass the user ID in the Authorization header
            }
        })
            .then(response => {
                console.log('Updated successfully');
                setIsEditing(false);
                toast({
                    title: "Details Updated!",
                    description: "That's great your details have been saved",
                    status: "success",
                    variant: "left-accent",
                    position: "top",
                    duration: 9000,
                    isClosable: true
                });
                fetchUserDetails(navigate, setUser, setUsersLoading);
            })
            .catch(err => {
                console.log("Error updating", err);
                toast({
                    position: "top",
                    variant: "left-accent",
                    title: "OOPS Details not updated",
                    description: "Error updating your personal details",
                    status: "error",
                    duration: 9000,
                    isClosable: true
                });
            });
    };
    

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setProfilePicture(file);
    };

    return (
        <>
            {!user ? (
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
                                bgColor= "gray.200"
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
                                <Text>{user.name}</Text>
                                <Button
                                    w = "xs"
                                    variant= "outline"
                                    colorScheme='primary'
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
                                h = "100%"
                                bgColor= "primary.500"
                                borderRadius= "xl"
                            >

                            </Box>
                            <Box
                                w = "100%"
                                h = '100%'
                                p = "2em"
                                mt = "1em"
                                color= "gray.100"
                                bgColor= "gray.500"
                                // boxShadow= "2xl"
                                borderRadius= "xl"
                            >
                                <Heading
                                    letterSpacing= "2px"
                                    textTransform= "uppercase"
                                >
                                    Doc-O-Meter
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
                                        borderColor="primary.400"
                                    >
                                        Heheh
                                    </Box>
                                    <Box
                                        p = "1em"
                                        w = "100%"
                                        borderRadius= "md"
                                        border="1px solid"
                                        borderColor="primary.400"
                                    >
                                        Heheh
                                    </Box>
                                    <Box
                                        p = "1em"
                                        w = "100%"
                                        borderRadius= "md"
                                        border="1px solid"
                                        borderColor="primary.400"
                                    >
                                        Heheh
                                    </Box>
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
