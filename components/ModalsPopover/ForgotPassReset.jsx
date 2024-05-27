import React, { useState } from 'react';
import { FormControl, Input, Modal, 
         ModalBody, ModalCloseButton, ModalContent, 
         ModalHeader, ModalOverlay, Stack, 
         Text, Button,FormLabel
} from '@chakra-ui/react';
import axios from 'axios';
import ErrorToast from '../Toasts/ErrorToast';
import { useNavigate } from 'react-router-dom';
import SuccessToast from '../Toasts/SuccessToast';

const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;


const ForgotPassReset  = ({isOpen, onClose, email}) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const handleSubmitPasswordRest = async () => {
        try{
            if(password == '' && rePassword == ''){
                ErrorToast("Invalid Submission", "The fields cannot be empty");
            }
            else if(password!== rePassword){
                ErrorToast("Passwords do not match", "Both the passwords do not match");
            }
            else{
                const response = await axios.patch(`${DOMAIN_NAME}/auth/changePassword`, {
                    email,
                    password
                });
                console.log("Your success res here", response);
                // navigate("/login");
                SuccessToast("Password Changed Successfully", "Please Login")
                window.location.reload();
            }
        }
        catch(error) {
            console.log("Error", error);
        }
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    
    const handleRePasswordChange = (event) => {
        setRePassword(event.target.value);
    }
    return(
        <>
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
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
                                <FormLabel>Enter New Password</FormLabel>
                                <Input 
                                    type='password'
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder='Enter your new password'
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Re-Enter New Password</FormLabel>
                                <Input 
                                    type='password'
                                    value={rePassword}
                                    onChange={handleRePasswordChange}
                                    placeholder='Re-Enter your new password'
                                />
                            </FormControl>
                            <Button
                                colorScheme='primary'
                                alignSelf={"flex-end"}
                                w = "fit-content"
                                onClick={handleSubmitPasswordRest}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ForgotPassReset;