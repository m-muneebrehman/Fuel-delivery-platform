"use client";

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Logo } from "../Home/logo";

export const Navbar = () => {
  const navigate = useNavigate();
  const navigationItems = [
    { title: "Orders", href: "/petrol-owner/dashboard" },
    { title: "Products", href: "/petrol-owner/dashboard" },
    { title: "Settings", href: "/petrol-owner/settings" },
  ];

  const handleLogout = () => {
    // Clear any stored tokens or user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to home page
    navigate('/');
  };

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
        height: "h-20",
        background: "backdrop-blur-xl bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90",
        marginTop: "mt-8",
      };
    }
    // First scroll threshold
    else if (scrollPosition < 150) {
      return {
        height: "h-16",
        background: "backdrop-blur-xl bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95",
        marginTop: "mt-4",
      };
    }
    // Further scrolling
    else {
      return {
        height: "h-16",
        background: "backdrop-blur-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900",
        marginTop: "mt-2",
      };
    }
  };

  const { height, background, marginTop } = getNavbarStyle();

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-transparent">
      <div 
        className={`mx-15 px-4 md:px-6 lg:px-8 ${marginTop} rounded-2xl ${background} text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-500 ease-in-out border border-white/10 hover:border-white/20`}
      >
        <div className={`flex items-center justify-between ${height} px-2 md:px-4 transition-all duration-500`}>
          {/* Logo aligned flush to the left */}
          <div className="flex items-center transition-all duration-500">
            <Logo />
          </div>

          {/* Navigation - right aligned */}
          <nav className="hidden lg:flex items-center gap-8 ml-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="text-white text-base font-medium px-3 py-2 rounded-lg hover:text-blue-400 transition-all duration-300 relative group"
              >
                {item.title}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300 delay-75"></span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white text-base font-medium px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all duration-300 group"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setOpen(!isOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white transform transition-transform duration-300 hover:rotate-90" />
              ) : (
                <Menu className="w-6 h-6 text-white transform transition-transform duration-300 hover:scale-110" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden w-full px-4 py-4 space-y-2 rounded-b-2xl border-t border-white/10 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl animate-slideDown">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="block text-white text-base font-medium px-4 py-3 rounded-lg hover:bg-white/10 hover:text-blue-400 transition-all duration-300 hover:translate-x-2"
              >
                {item.title}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-white text-base font-medium px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};