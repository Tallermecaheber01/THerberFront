import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Nanvar";
import AppRoutes from "./Routes";
import Footer from "./Fotter";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;