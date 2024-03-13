import axios from "axios";
import React from 'react';
import ErrorToast from "../components/Toasts/ErrorToast";
import SuccessToast from "../components/Toasts/SuccessToast";

const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const fetchUploadedPDFs = async (setUploadedPdfs, setUploadedPdfsLoading, user) => {
    try {
        // Make a GET request to the endpoint that serves PDFs
        const response = await axios.get(`${DOMAIN_NAME}/pdf/${user.id}/pdfs`);
        // Extract the PDFs from the response data
        const pdfFiles = response.data;
        //   return pdfs;
        setUploadedPdfs(pdfFiles);
        setUploadedPdfsLoading(false);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        return [];
    }
};

    // DELETE delete a PDF file by ID
    const handleDeleteUploadedPdf = async (pdfId, user, setUploadedPdfs, setUploadedPdfsLoading) => {
        try {
            // Make a DELETE request to delete the PDF file
            await axios.delete(`${DOMAIN_NAME}/pdf/${user.id}/pdfs/${pdfId}`, {
                headers: {
                    'Authorization': `Bearer ${user.id} ` // Pass the user ID in the Authorization header
                }
            });
            fetchUploadedPDFs(setUploadedPdfs, setUploadedPdfsLoading, user);

            const title ="PDF Deleted!";
            const description = "File Deleted Successfully"; 

            SuccessToast(title, description);

            console.log('PDF deleted successfully');
        } catch (err) {

            const title = "OOPS PDF not Deleted!";
            const description = "Error Deleting the File";

            ErrorToast(title, description);

            console.error('Error deleting PDF:', err);
        }
    };

export {
    fetchUploadedPDFs,
    handleDeleteUploadedPdf
}