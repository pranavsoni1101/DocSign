import React, { useState, useRef } from 'react';
import {
  Modal, ModalOverlay,ModalContent,
  ModalHeader, ModalBody,ModalCloseButton,
  Tabs,TabList,Tab,
  TabPanels,TabPanel,FormControl,
  FormLabel,Input,Button,
  Text,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';

const UploadSignModal = ({ isOpen, user, setIsOpen }) => {
  // State to set the type of signature, i.e. Draw/Upload/Text
  // const [type, setType] = useState("");
  const signatureRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [textSignature, setTextSignature] = useState("");

  const handleNameChange = (event) => {
    setTextSignature(event.target.value)
  };

  const handleFileName = (event) => {
    setFileName(event.target.value)
  };

  const handleDrawSignatureUpload = async () => {
    const signatureDataUrl = signatureRef.current.toDataURL(); // Get signature as data URL
    const signatureBlob = await fetch(signatureDataUrl).then(res => res.blob()); // Convert data URL to Blob
    const formData = new FormData();
    formData.append('signature', signatureBlob, fileName);
    formData.append('type', 'draw'); // Append the type information
    try {
      await axios.post(`http://localhost:3001/signature/${user.id}/signatures`, formData);
      setFileName("");
      signatureRef.current.clear();
      console.log('Signature uploaded successfully');
    } catch (error) {
      console.error('Error uploading signature:', error);
    }
  };

  const handleClear = () => {
    signatureRef.current.clear();
    setFileName("");
  }

  const handleTextSignatureUpload = async () => {
    const blob = new Blob([textSignature], { type: "text/plain" });
    const formData = new FormData();
    formData.append('signature', blob, `${textSignature} signature`);
    formData.append('type', "text");
    try {
            await axios.post(`http://localhost:3001/signature/${user.id}/signatures`, formData)
            .then(response=>{
                console.log("Successfully added text signature");
                // fetchSignatures();
            })
            .catch((err) => console.log("Error saving text signature", err))
        }
    catch (err){
        console.log("There has been an error", err);
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Draw/Upload/Type Signature</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs isFitted>
            <TabList>
              <Tab>Draw</Tab>
              <Tab>Upload</Tab>
              <Tab>Text</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                
                <Text
                  fontWeight= "bold"
                >
                  Draw Signature
                </Text>
                <Box border="1px solid black">
                  <SignatureCanvas ref={signatureRef}/>
                </Box>
                <FormControl>
                  <Input 
                    type='text'
                    value={fileName}
                    onChange={handleFileName}
                    placeholder='Enter File Name'
                  />
                </FormControl>
                <Button 
                    mt = "1em"
                    colorScheme='green'
                    onClick={handleDrawSignatureUpload}
                >
                    Save Signature
                </Button>
                <Button 
                    mt = "1em"
                    colorScheme='yellow'
                    onClick={handleClear}
                >
                    Clear
                </Button>   
              </TabPanel>
              <TabPanel>
              <p>Content for Tab 1</p>
              </TabPanel>
              <TabPanel>
                <FormControl>
                  <FormLabel>Name to Sign</FormLabel>
                  <Input 
                    type='text'
                    value={textSignature}
                    onChange={handleNameChange}
                    placeholder='Write your name to sign'
                  />
                  <Button
                    mt ="1em"
                    colorScheme='green'
                    onClick={handleTextSignatureUpload}
                  >
                    Upload Signature
                  </Button>
                </FormControl>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadSignModal;
