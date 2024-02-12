import { Container, Image, Heading, Box, Text, Button, FormControl, Input, FormLabel, useToast, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import fetchUserDetails from '../../utils/fetchUser';
import { useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import axios from 'axios';

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
            .catch(err => console.log("Error updating", err));
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
                <Container maxW="100%">
                    <Heading>Edit Profile</Heading>
                    <Image boxSize="xs" borderRadius="full" src={`data:image/png;base64,${user.profilePicture}`} />
                    <Button mt="1em" colorScheme='twitter' onClick={() => setIsEditing(true)} rightIcon={<FaPen />}>Edit</Button>

                    {isEditing ? (
                        <Container maxW="100%">
                            <Box p="1em" w="sm" my="1em" borderRadius="xl" boxShadow="2xl">
                                <FormControl>
                                    <FormLabel>Upload Picture</FormLabel>
                                    <Input type='file' accept="image/png, image/jpeg" onChange={handleFileUpload} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Phone</FormLabel>
                                    <Input type='text' value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Address</FormLabel>
                                    <Input type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
                                </FormControl>
                                <Button my="1em" colorScheme='green' onClick={handleUpdate}>Save Changes</Button>
                            </Box>
                        </Container>
                    ) : (
                        <Container maxW="100%">
                            <Box mt="1em">
                                <Heading as="h3" size="md" display="inline-block">Name:</Heading>
                                <Text ml="1em" display="inline-block">{user.name}</Text>
                            </Box>
                            <Box mt="1em">
                                <Heading as="h3" size="md" display="inline-block">Email:</Heading>
                                <Text ml="1em" display="inline-block">{user.email}</Text>
                            </Box>
                            <Box mt="1em">
                                <Heading as="h3" size="md" display="inline-block">Phone:</Heading>
                                <Text ml="1em" display="inline-block">{user.phone}</Text>
                            </Box>
                            <Box mt="1em">
                                <Heading as="h3" size="md" display="inline-block">Address:</Heading>
                                <Text ml="1em" display="inline-block">{user.address}</Text>
                            </Box>
                        </Container>
                    )}
                </Container>
            )}
        </>
    );
};

export default Profile;
