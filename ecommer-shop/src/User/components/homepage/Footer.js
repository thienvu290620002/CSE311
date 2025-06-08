import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-24">
          {/* About Us */}
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="hover:underline">
                  Our Shops
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:underline">
                  Artists
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:underline">
                  Local Giving
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:underline">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 md:flex md:flex-col md:justify-center">
            <h3 className="font-semibold text-xl mb-4 lg:text-center">
              Sign Up For Our Newsletter To Receive Notifications And Other
              Promotions
            </h3>
            <div className="flex mt-4">
              <input
                type="email"
                placeholder="Email address..."
                className="flex-grow px-4 py-4 rounded-l-full border border-r-0 border-gray-300 focus:outline-none focus:border-black"
              />
              <button className="bg-black text-white px-6 py-2 rounded-r-full hover:bg-gray-800 transition duration-300">
                Subscribe
              </button>
            </div>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faqs" className="hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/store-locator" className="hover:underline">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:underline">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="hover:underline">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/wholesale" className="hover:underline">
                  Wholesale
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Copyright © 2024. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
