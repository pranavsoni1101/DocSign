import { Container, Image, Heading, Box, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import fetchUserDetails from '../../utils/fetchUser';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [usersLoading, setUsersLoading] = useState(true); 

    useEffect(() => {
        fetchUserDetails(navigate,setUser,setUsersLoading);
    }, [])
    return(
        <>
        {usersLoading?
            (
                <Box>Loading...</Box>
            )
            :
            (
                <Container
                    maxW= "100%"
                >
                    <Heading>Edit Profile</Heading>
                    <Image 
                        m = "0 auto"
                        boxSize= "xs"
                        borderRadius= "full"
                        src='https://images.unsplash.com/photo-1548658166-136d9f6a7e76?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    />
                    <Container
                        m = "0 auto"
                    >
                        <Box
                            mt = "1em"
                        >
                            <Heading as = "h3" size="md" display= "inline-block">
                                Name:
                            </Heading>
                            <Text ml = "1em" display="inline-block">{user.name}</Text>
                        </Box>
                        <Box
                            mt = "1em"
                        >
                            <Heading as = "h3" size="md" display= "inline-block">
                                Email:
                            </Heading>
                            <Text ml = "1em" display="inline-block">{user.email}</Text>
                        </Box>
                        <Box
                            mt = "1em"
                        >
                            <Heading as = "h3" size="md" display= "inline-block">
                                Phone:
                            </Heading>
                            <Text ml = "1em" display="inline-block">Phone: {user.name}</Text>
                        </Box>
                        <Box
                            mt = "1em"
                        >
                            <Heading as = "h3" size="md" display= "inline-block">
                                Address:
                            </Heading>
                            <Text ml = "1em" display="inline-block">Address:</Text>
                        </Box>
                    </Container>
                </Container>

            )
        }
        </>
    )
}

export default Profile;