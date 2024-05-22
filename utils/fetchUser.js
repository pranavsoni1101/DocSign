import Cookies from 'js-cookie';
import parseJWT from './parseJWT';

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



export default fetchUserDetails;
