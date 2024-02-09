import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import App from './App';
import Navbar from '../components/Navbar';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import ViewPdf from './Pages/ViewPdf';
import Envelope from './Pages/Envelope';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/pdf/:id/:fileName',
    element: <ViewPdf />
  },
  {
    path: '/createEnvelope',
    element: <Envelope />
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