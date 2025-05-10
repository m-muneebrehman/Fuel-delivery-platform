"use client";

import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "../Home/logo";

export const Navbar = () => {
  const navigationItems = [
    { title: "Orders", href: "/petrol-owner/dashboard" },
    { title: "Products", href: "/petrol-owner/dashboard" },
    { title: "Settings", href: "/petrol-owner/settings" },
  ];

  const [isOpen, setOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine navbar style based on scroll position
  const getNavbarStyle = () => {
    // Initial state
    if (scrollPosition < 50) {
      return {
        height: "h-28",
        background: "bg-gray-600 bg-opacity-95",
        marginTop: "mt-8",
      };
    }
    // First scroll threshold
    else if (scrollPosition < 150) {
      return {
        height: "h-25",
        background: "bg-gray-700 bg-opacity-95",
        marginTop: "mt-4",
      };
    }
    // Further scrolling
    else {
      return {
        height: "h-22",
        background: "bg-gray-800 bg-opacity-95",
        marginTop: "mt-2",
      };
    }
  };

  const { height, background, marginTop } = getNavbarStyle();

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-transparent">
      <div className={`mx-15 px-4 md:px-6 lg:px-8 ${marginTop} rounded-xl ${background} text-white shadow-lg transition-all duration-300 ease-in-out`}>
        <div className={`flex items-center justify-between ${height} px-2 md:px-4 transition-all duration-300`}>
          {/* Logo aligned flush to the left */}
          <div className="flex items-center transition-all duration-300">
            <Logo />
          </div>

          {/* Navigation - right aligned */}
          <nav className="hidden lg:flex items-center gap-4 ml-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="bg-red-100 text-red-700 text-md px-3 py-2 rounded-md hover:outline-2 hover:outline-red-500 hover:bg-red-200 transition duration-200"
                >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setOpen(!isOpen)}
              aria-label="Toggle Menu"
              className="focus:outline-none"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden w-full px-4 py-4 space-y-3 rounded-b-xl border-t border-gray-700">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="block text-white text-md px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
              >
                {item.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};