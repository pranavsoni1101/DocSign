import React from 'react';
import { createStandaloneToast } from "@chakra-ui/react";

const SuccessToast = (title, description) => {
    const {ToastContainer, toast} = createStandaloneToast();
    return(
        toast({
            position: "top",
            variant: "left-accent",
            title: title,
            description: description,
            status: "success",
            duration: 1200,
            isClosable: true
        })
    )
};

export default SuccessToast;