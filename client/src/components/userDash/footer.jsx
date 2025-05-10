import React from "react"

function Footer() {
  return (
    <div>
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AutoParts Hub</h3>
              <p className="text-gray-400">
                Your one-stop solution for all vehicle spare parts. Quality
                products at competitive prices.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Shop", "About Us", "Contact", "Blog"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Customer Support</h4>
              <ul className="space-y-2">
                {[
                  "FAQ",
                  "Shipping Policy",
                  "Returns & Refunds",
                  "Track Order",
                  "Privacy Policy",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Subscribe to Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 rounded-l-lg text-gray-800 w-full focus:outline-none"
                />
                <button className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition">
                  Subscribe
                </button>
              </div>
              <div className="mt-4 flex space-x-4">
                {["Facebook", "Twitter", "Instagram", "YouTube"].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      {social[0]}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; 2025 AutoParts Hub. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img src="/api/placeholder/40/25" alt="Visa" className="h-6" />
              <img
                src="/api/placeholder/40/25"
                alt="Mastercard"
                className="h-6"
              />
              <img src="/api/placeholder/40/25" alt="PayPal" className="h-6" />
              <img
                src="/api/placeholder/40/25"
                alt="Apple Pay"
                className="h-6"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
