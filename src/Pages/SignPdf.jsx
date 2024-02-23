import { Heading, Button, Input, Box } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib'; // Import PDFDocument from pdf-lib
import { useNavigate, useParams } from 'react-router-dom';
import fetchUserDetails from '../../utils/fetchUser';

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
                const response = await axios.get(`http://localhost:3001/pdf/pending/${id}/${user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPdf(response.data);
                const pdfBlob = new Blob([response.data.data], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);
                setPdfBytes(pdfUrl);
                console.log("bytessss",typeof(pdfBytes), pdfUrl);
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
                        <Heading mb={4}>Sign PDF</Heading>
                        {pdfBytes && (
                            <>
                                <embed src={`data:application/pdf;base64,${pdfBytes}`} type="application/pdf" width="100%" height="600px" />
                                <form>
                                    {pdf.inputFields.map((field,index) => (
                                        <Input
                                            key={index}
                                            name={field.id}
                                            
                                            placeholder={`${field.pageIndex}, x: ${field.x} ,y: ${field.y}`}
                                            value={formData[field.id] || ''}
                                            onChange={handleInputChange}
                                            posistion = "absolute"
                                            left = {field.x}
                                            top = {field.y}
                                            mb={4}
                                        />
                                    ))}
                                    <Button
                                        colorScheme="teal"
                                        isLoading={loading}
                                        loadingText="Submitting"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                </form>
                            </>
                        )}
                    </>
                )}
        </>
    );
};

export default SignPdf;
