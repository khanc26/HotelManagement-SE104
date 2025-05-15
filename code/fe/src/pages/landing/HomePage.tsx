import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        id="home"
        className="relative bg-cover bg-center h-screen"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full text-center text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Streamline Your Hotel Management
            </h1>
            <p className="mt-6 max-w-md mx-auto text-lg sm:text-xl">
              Manage bookings, invoices, and rooms effortlessly with HotelPro.
            </p>
            <div className="mt-10">
              <Link
                to="/"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful Features for Hotel Management
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to run your hotel efficiently.
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3 sm:grid-cols-2">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
              <svg
                className="h-12 w-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-6 text-xl font-medium text-gray-900">
                Booking Management
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Easily manage reservations, check-ins, and check-outs with a
                user-friendly interface.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
              <svg
                className="h-12 w-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-6 text-xl font-medium text-gray-900">
                Invoice Tracking
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Generate and track invoices with detailed breakdowns for guests
                and staff.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
              <svg
                className="h-12 w-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-6 text-xl font-medium text-gray-900">
                Room Management
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Assign and monitor room statuses, ensuring optimal occupancy and
                maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Trusted by hotel managers worldwide.
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3 sm:grid-cols-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                "HotelPro has transformed how we manage our bookings. The
                invoice tracking feature saves us hours every week!"
              </p>
              <div className="mt-4 flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://randomuser.me/api/portraits/women/1.jpg"
                  alt="Sarah Johnson"
                />
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">Sarah Johnson</p>
                  <p className="text-gray-500 text-sm">Hotel Manager</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                "The room management system is intuitive and helps us keep
                everything organized. Highly recommend!"
              </p>
              <div className="mt-4 flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://randomuser.me/api/portraits/men/2.jpg"
                  alt="Michael Chen"
                />
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">Michael Chen</p>
                  <p className="text-gray-500 text-sm">Operations Lead</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                "A game-changer for our small hotel. The interface is clean, and
                support is fantastic."
              </p>
              <div className="mt-4 flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://randomuser.me/api/portraits/women/3.jpg"
                  alt="Emily Davis"
                />
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">Emily Davis</p>
                  <p className="text-gray-500 text-sm">Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Transform Your Hotel Management?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
            Sign up today and experience the power of HotelPro.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition"
            >
              Start Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
