import React, { useState } from 'react';
import { FormControl, Input, Modal, ModalBody, ModalCloseButton, 
         ModalContent, ModalHeader, ModalOverlay,
         Stack, Text, Button,
         useDisclosure
} from '@chakra-ui/react';
import ForgotPassVerifyOTP from './ForgotPassVerifyOTP';
import Cookies from 'js-cookie';
import axios from 'axios';
import parseJWT from '../../utils/parseJWT';
const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const ForgotPassGetMail = ({open, close}) => {

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(null);

    const {isOpen, onOpen, onClose} = useDisclosure();

    const handleNextButtonClick = async () => {
        try{
            const response = await axios.get(`${DOMAIN_NAME}/auth/requestOtp`, {
                params: {
                    email: email
                }
            });
            const {otpToken} = response.data;
            Cookies.set("otp", otpToken, { expires: 1 / 480 });
            console.log("Response", parseJWT(otpToken));
            setOtp(parseJWT(otpToken));
            onOpen();
        }
        catch(error) {
            console.log("Erorr", error);
        }
    }
    return(
        <>
            <Modal 
                isOpen={open} 
                onClose={close} 
                isCentered
                motionPreset='slideInBottom'
                size= "md"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Forgot Your Password?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack>
                            <Text>You'll Recieve an OTP to reset the password</Text>
                            <FormControl>
                                <Input 
                                    type='email'
                                    name = "email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter your registered email'
                                />
                            </FormControl>
                            <Button
                                colorScheme='primary'
                                alignSelf={"flex-end"}
                                w = "fit-content"
                                onClick={handleNextButtonClick}
                            >
                                Next
                            </Button>
                            <ForgotPassVerifyOTP modalOpen={isOpen} modalClose={onClose} otp={otp} email = {email}/>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ForgotPassGetMail