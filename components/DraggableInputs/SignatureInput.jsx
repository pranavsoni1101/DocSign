import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Button, Box, Text } from '@chakra-ui/react';
import UploadSignModal from '../ModalsPopover/UploadSignModal';


const SignatureInput = ({ x, y, index, isOpen,user, setIsOpen }) => {

    const [{ isDragging }, drag] = useDrag({
        type: 'input',
        item: {  x, y },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <Box
            ref={drag}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                opacity: isDragging ? 0.5 : 1,
            }}
        >   
            <Text>{index} Button position is x: {x} and y: {y}</Text>
            <Button
                onClick={() => setIsOpen(true)}
            >Sign Here</Button>
            <UploadSignModal 
                isOpen={isOpen}
                user = {user}
                setIsOpen = {setIsOpen}
            />
        </Box>
    )
}

export default SignatureInput;