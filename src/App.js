import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Nanvar';
import AppRoutes from './Routes';
import Footer from './Fotter';
import { AuthProvider } from './components/AuthContext';
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        <Router>
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
