import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import App from './App';
import Navbar from '../components/Navbar';
// import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import ViewPdf from './Pages/ViewPdf';
import Envelope from './Pages/Envelope';
import Profile from './Pages/Profile';
import PendingDocs from './Pages/PendingDocs';
import SignPdf from './Pages/SignPdf';
import theme from '../theme';
import Footer from '../components/Footer';


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />
//   },
//   {
//     path: '/login',
//     element: <Login />
//   },
//   {
//     path: '/signup',
//     element: <SignUp />
//   },
//   // {
//   //   path: '/dashboard',
//   //   element: <Dashboard />
//   // },
//   {
//     path: '/pdf/:id/:fileName',
//     element: <ViewPdf />
//   },
//   {
//     path: '/createEnvelope',
//     element: <Envelope />
//   }
//   ,
//   {
//     path: '/profile',
//     element: <Profile />
//   },
  // {
  //   path: '/pendingDocs',
  //   element: <PendingDocs />
  // },
//   {
//     path: '/sign/:id/:fileName',
//     element: <SignPdf />
//   },
// ])

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      {/* <RouterProvider router={router}/> */}
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/pdf/:id/:fileName" element={<ViewPdf />} />
          <Route path="/createEnvelope" element={<Envelope />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sign/:id/:fileName" element={<SignPdf />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)