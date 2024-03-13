import axios from "axios";
const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;
// ####################### FETCH THE PDFS THAT ARE TO BE SIGNED BY AN INDIVIDUAL #############################

const fetchPendingToBeSignedPdfs = async (setPendingPdfs, setPendingPdfsLoading) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${DOMAIN_NAME}/pdf/pending/toBeSignedPdf`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Pendinggggg", response.data);
        setPendingPdfs(response.data);
        setPendingPdfsLoading(false);
    }
    catch (error) {
        console.log("Errrorr", error);
    }
    
};

// #############################################################################################

// ################################## ACCEPT TO SIGN THE PDF ###################################
const handleAcceptToSignPdf = async (pdfID) => {
    try{
        const token = sessionStorage.getItem("token");
        console.log("this toke", token);
        await axios.post(`${DOMAIN_NAME}/pdf/pdfs/${pdfID}/accept`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {console.log("Hurray Accepted!!!");fetchPendingToBeSignedPdfs()})
    }
    catch (error) {
        console.log("Error updating Acceptance", error);
    }
};

// #############################################################################################

// #################### HANDLE DELAY IN SIGNING THE PDF ####################################

const handleDelayToSignPdf = async (pdfID) => {
    try{
        const token = sessionStorage.getItem("token");
        console.log("this toke", token);
        await axios.post(`${DOMAIN_NAME}/pdf/pdfs/${pdfID}/delay`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {console.log("Hurray Delayed!!!");fetchPendingToBeSignedPdfs()})
    }
    catch (error) {
        console.log("Error updating Delay", error);
    }
};

// #############################################################################################


// #################### HANDLE REJECTION IN NOT SIGNING THE PDF ####################

const handleRejectToSignPdf = async (pdfID) => {
    try{
        const token = sessionStorage.getItem("token");
        console.log("this toke", token);
        await axios.post(`${DOMAIN_NAME}/pdf/pdfs/${pdfID}/reject`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {console.log("Hurray Rejected!!!");fetchPendingToBeSignedPdfs()})
    }
    catch (error) {
        console.log("Error updating rejection", error);
    }
};

// #############################################################################################

export {
    fetchPendingToBeSignedPdfs,
    handleAcceptToSignPdf,
    handleDelayToSignPdf,
    handleRejectToSignPdf
};