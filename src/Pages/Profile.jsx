import { Container, Image, Heading, Box, Text, Button, FormControl, Input, FormLabel } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import fetchUserDetails from '../../utils/fetchUser';
import { useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import axios from 'axios';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [usersLoading, setUsersLoading] =  useState(true);

    useEffect(() => {
        fetchUserDetails(navigate, setUser, setUsersLoading);
    }, []);

    const handleUpdate = () => {
        const updatedUser = {
            name: name,
            phone: phone,
            address: address
        };

        const token = sessionStorage.getItem('token');

        axios.patch("http://localhost:3001/auth/user", updatedUser, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Pass the user ID in the Authorization header
            }
        })
            .then(response => {
                console.log('Updated successfully');
                setIsEditing(false);
            })
            .catch(err => console.log("Error updating", err));
    };

    return (
        <>
            {!user ? (
                <Box>Loading...</Box>
            ) : (
                <Container maxW="100%">
                    <Heading>Edit Profile</Heading>
                    <Image boxSize="xs" borderRadius="full" src={user.profilePicture} />
                    <Button mt="1em" colorScheme='twitter' onClick={() => setIsEditing(true)} rightIcon={<FaPen />}>Edit</Button>

                    {isEditing ? (
                        <Container maxW="100%">
                            <Box p="1em" w="sm" my="1em" borderRadius="xl" boxShadow="2xl">
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
