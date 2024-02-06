import { Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const App = () => {
    return(
        <>
            <Heading>This is Home</Heading>
            <Text>Hss</Text>
        </>
    )
}

export default App;