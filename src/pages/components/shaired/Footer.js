import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-10">
      <div className="container mx-auto px-6 md:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">About Us</h2>
            <p className="text-sm">
              We are dedicated to providing the best products and services. Our goal is to ensure customer satisfaction with every interaction.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-bold mb-4">Quick Links</h2>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-gray-200">Home</a></li>
              <li className="mb-2"><a href="#" className="hover:text-gray-200">Services</a></li>
              <li className="mb-2"><a href="#" className="hover:text-gray-200">Products</a></li>
              <li className="mb-2"><a href="#" className="hover:text-gray-200">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Contact Us</h2>
            <p className="text-sm mb-2">1234 Street Name</p>
            <p className="text-sm mb-2">City, State, 12345</p>
            <p className="text-sm mb-2">Email: contact@company.com</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Follow Us</h2>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="hover:text-gray-200">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="hover:text-gray-200">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="hover:text-gray-200">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="hover:text-gray-200">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 text-center border-t border-gray-300 pt-6">
          <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
