import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Nanvar';
import AppRoutes from './Routes';
import FAQ from './FAQ';
import Footer from './Fotter';
import { AuthProvider } from './components/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        <Router>
        <ToastContainer autoClose={6000} />
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
          <FAQ/>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
