import React from "react";
import Navbar from "./components/shaired/Navber";
import Footer from "./components/shaired/Footer";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
