import React from 'react';
import { useDrag } from 'react-dnd';
import { FormLabel, FormControl, Box, Input  } from '@chakra-ui/react';

const NameInput = ({ x, y, index }) => {
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
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input 
                    w ="sm" 
                    bg="pink" 
                    size="xs"
                    type="text" 
                    zIndex={2} 
                    placeholder={`${index} input position is x: ${x} and y: ${y}`}
                />
            </FormControl>
        </Box>
    );
};

export default NameInput;