import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
          try {
            // Check if token exists in session storage
            const token = sessionStorage.getItem('token');
            if (!token) {
              // If token doesn't exist, redirect to login
              navigate("/login");
              return;
            }
            
            // Make a GET request to the /user endpoint with the token as a bearer token
            const response = await axios.get('http://localhost:3001/auth/user', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            // Set the user state with the received user details
            setUser(response.data);
            console.log("State", user);
            console.log(response.data);
          } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Error fetching user details');
          }
        };
      
        fetchUserDetails();
      }, [navigate]);
      


  return (
    <>
        <Heading>Dashboard</Heading>
        <Heading
            as = "h2"
        >
            Hi {user.name}
        </Heading>
        <Text>Email: {user.email}</Text>
    </>
  );
};

export default Dashboard;
