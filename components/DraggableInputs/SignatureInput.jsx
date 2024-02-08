import React from 'react';
import { useDrag } from 'react-dnd';
import { Button, Box } from '@chakra-ui/react';


const SignatureInput = ({ x, y, index }) => {
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
            <Button>Sign Here</Button>
        </Box>
    )
}

export default SignatureInput;