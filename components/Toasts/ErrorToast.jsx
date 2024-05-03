import React from 'react';
import { createStandaloneToast } from "@chakra-ui/react";

const ErrorToast = (title, description) => {
    const {ToastContainer, toast} = createStandaloneToast();
    return(
        toast({
            position: "top",
            variant: "left-accent",
            title: title,
            description: description,
            status: "error",
            duration: 1200,
            isClosable: true
        })
    )
};

export default ErrorToast;