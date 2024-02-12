import React from 'react';
import { Modal, ModalBody, ModalContent, 
         ModalHeader, FormControl, Input, 
         ModalOverlay, ModalCloseButton, FormLabel,
         Button, ModalFooter         
} from '@chakra-ui/react'; 

const UploadPdfModal = ({isOpen, setIsOpen, handlePdfFileChange, handlePdfUpload}) => {
    return(
        <>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload PDF</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Select PDF File:</FormLabel>
                            <Input type="file" onChange={handlePdfFileChange} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UploadPdfModal;