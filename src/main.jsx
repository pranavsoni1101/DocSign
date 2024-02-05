import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import App from './App';
import Navbar from '../components/Navbar';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './Pages/Login';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: '/login',
    element: <Login />
  }
])

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <Navbar />
      <RouterProvider router={router}/>
    </ChakraProvider>
  </React.StrictMode>,
)