// import axios from "axios";
// const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;
// const fetchUserDetails = async (navigate, setUser, setUsersLoading) => {
//     try {
//         // Check if token exists in session storage
//         const token = sessionStorage.getItem('token');
//         if (!token) {
//             // If token doesn't exist, redirect to login
//             navigate("/login");
//             return;
//         }
        
//         // Make a GET request to the /user endpoint with the token as a bearer token
//         const response = await axios.get(`${DOMAIN_NAME}/auth/user`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         // Set the user state with the received user details
//         if (response.status === 200) {
//             setUser(response.data);
//         }
//         setUsersLoading(false); // Set loading state to false after user details are fetched
//     } catch (err) {
//         console.error('Error fetching user details:', err);
//         setError('Error fetching user details');
//     }
// };

// export default fetchUserDetails;

import axios from "axios";
import Cookies from 'js-cookie';
const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const fetchUserDetails = async (navigate, setUser, setUsersLoading, setError) => {
    try {
        // Check if token exists in cookies
        const token = Cookies.get('jwt');
        if (!token) {
            // If token doesn't exist, redirect to login
            navigate("/login");
            return;
        }
        
        // Decode the token to obtain user data
        const userData = parseJWT(token);

        // Set the user state with the received user data
        setUser(userData);

        setUsersLoading(false); // Set loading state to false after user details are fetched
    } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Error fetching user details');
    }
};

const parseJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export default fetchUserDetails;
