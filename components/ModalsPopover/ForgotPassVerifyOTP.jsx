import React, { useState } from 'react';
import { FormControl, Input, Modal, ModalBody, ModalCloseButton, 
    ModalContent, ModalHeader, ModalOverlay,
    Stack, Text, Button,
    useDisclosure, PinInput, PinInputField,
    HStack,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import ForgotPassReset from './ForgotPassReset';


const ForgotPassVerifyOTP = ({modalOpen, modalClose, otp, email}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [otpVal, setOtpVal]= useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    
    const handleOtpChange = (value) => {
        setOtpVal(value);
        console.log(otpVal);
    }

    const handleNextButtonClick = () => {
        if(otp === Number(otpVal)){
            setOtpVerified(true);
            console.log("Verified");
            onOpen();
        }
    }

    return(
        <>
            <Modal 
                isOpen={modalOpen} 
                onClose={modalClose} 
                isCentered
                motionPreset='slideInBottom'
                size= "md"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Verify The OTP </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack>
                            <Text>You'll Recieve an OTP to reset the password</Text>
                            <FormControl>
                            <HStack>
                                <PinInput otp value={otpVal} onChange={handleOtpChange}>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                            </FormControl>
                            <Button
                                colorScheme='primary'
                                alignSelf={"flex-end"}
                                w = "fit-content"
                                onClick={handleNextButtonClick}
                            >
                                Verify
                            </Button>
                            {
                                otpVerified &&
                                (
                                    <Alert status='success'>
                                        <AlertIcon />
                                        OTP Verified
                                    </Alert>
                                )
                            }
                            <ForgotPassReset isOpen={isOpen} onClose={onClose} email= {email}/>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ForgotPassVerifyOTP;