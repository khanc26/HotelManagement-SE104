import * as React from "react";
import { Link, Outlet } from "react-router-dom";

const LandingLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen w-screen bg-gray-100 font-sans min-w-[600px] overflow-x-auto">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">
                  HotelPro
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="/"
                  className="border-b-2 border-transparent text-gray-500 hover:border-blue-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="#features"
                  className="border-b-2 border-transparent text-gray-500 hover:border-blue-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="border-b-2 border-transparent text-gray-500 hover:border-blue-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Testimonials
                </a>
                <a
                  href="#contact"
                  className="border-b-2 border-transparent text-gray-500 hover:border-blue-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                to="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                Start
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16m-7 6h7"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
              <a
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              >
                Home
              </a>
              <a
                href="#features"
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              >
                Contact
              </a>
              <Link
                to="/bookings"
                className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main>{<Outlet />}</main>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-medium">HotelPro</h3>
              <p className="mt-2 text-gray-400 text-sm">
                Your all-in-one solution for hotel management.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium">Links</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium">Contact</h3>
              <p className="mt-2 text-gray-400 text-sm">
                Email: support@hotelpro.com
                <br />
                Phone: +1 (123) 456-7890
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 HotelPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
