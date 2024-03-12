import { Heading, Button, Input, Box } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib'; // Import PDFDocument from pdf-lib
import { useNavigate, useParams } from 'react-router-dom';
import fetchUserDetails from '../../utils/fetchUser';

const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const SignPdf = () => {
    const { id, fileName } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [pdfBytes, setPdfBytes] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails(navigate, setUser, setLoading);
    }, []);

    useEffect(() => {
        if (!loading) {
            fetchPdfData();
        }
    }, [loading]);

    const fetchPdfData = async () => {
        try {
            if (user && id) { // Ensure user and id are defined
                const token = sessionStorage.getItem("token");
                const response = await axios.get(`${DOMAIN_NAME}/pdf/pending/${id}/${user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPdf(response.data);
                const pdfData = btoa(
                    new Uint8Array(response.data.data.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setPdfBytes(pdfData);
                console.log('PDF Data:', pdfData); // Log PDF data for debugging
                // console.log("this is the pdf", response.data)
            }
        } catch (error) {
            console.error('Error fetching PDF data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const modifiedPdfBytes = await fillPdfForm(pdfBytes, formData);
            await saveModifiedPdf(modifiedPdfBytes);
            setFormData({});
            fetchPdfData();
        } catch (error) {
            console.error('Error updating PDF data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fillPdfForm = async (pdfBytes, formData) => {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        for (const [fieldName, fieldValue] of Object.entries(formData)) {
            const field = form.getField(fieldName);
            if (field) field.setText(fieldValue);
        }

        return await pdfDoc.save();
    };

    const saveModifiedPdf = async (modifiedPdfBytes) => {
        await axios.post('/api/pdf/save', { pdfBytes: modifiedPdfBytes });
    };

    return (
        <>
            {loading ?
                <Box>Loading</Box>
                :
                (
                    <>
                        <div style={{ position: 'relative' }}>
                            <Heading mb={4}>Sign PDF</Heading>
                            {pdfBytes && (
                                <>
                                    <embed src={`data:application/pdf;base64,${pdfBytes}`} type="application/pdf" width="100%" height="600px" />
                                        {pdf.inputFields.map((field, index) => (
                                            <Input
                                                key={index}
                                                w = "xs"
                                                name={field.id}
                                                placeholder={`${field.pageIndex}, x: ${field.x}, y: ${field.y}`}
                                                value={formData[field.id] || ''}
                                                zIndex={999} // Ensure input fields are displayed above the PDF
                                                onChange={handleInputChange}
                                                style={{ position: 'absolute', left: `${field.x}px`, top: `${field.y}px` }}
                                            />
                                        ))}
                                        <Button
                                            colorScheme="teal"
                                            isLoading={loading}
                                            loadingText="Submitting"
                                            onClick={handleSubmit}
                                            style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                        >
                                            Submit
                                        </Button>
                                </>
                            )}
                        </div>
                    </>
                )}
        </>
    );
};

export default SignPdf;
