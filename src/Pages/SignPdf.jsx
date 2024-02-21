import React, { useState, useEffect } from 'react';
import { Heading, Spinner  } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import fetchUserDetails from '../../utils/fetchUser';

const SignPdf = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState()
    const [userLoading, setUserLoading] = useState(true); 

    useEffect(()=> {
        fetchUserDetails(navigate, setUser, setUserLoading);
    }, [])

    return(
        <>
            {
                userLoading? 
                    (
                        <Spinner 
                            position= "fixed"
                            top= "50%"
                            left= "50%"
                            size = "xl"
                            transform= "translate(-50%, -50%)"
                        />
                    )
                :
                (
                    <Heading>This is sign pdf</Heading>
                )
            }
        </>
    )
}

export default SignPdf;