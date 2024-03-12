import axios from "axios";
const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;
const fetchUserDetails = async (navigate, setUser, setUsersLoading) => {
    try {
        // Check if token exists in session storage
        const token = sessionStorage.getItem('token');
        if (!token) {
            // If token doesn't exist, redirect to login
            navigate("/login");
            return;
        }
        
        // Make a GET request to the /user endpoint with the token as a bearer token
        const response = await axios.get(`${DOMAIN_NAME}/auth/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Set the user state with the received user details
        if (response.status === 200) {
            setUser(response.data);
        }
        setUsersLoading(false); // Set loading state to false after user details are fetched
    } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Error fetching user details');
    }
};

export default fetchUserDetails;
