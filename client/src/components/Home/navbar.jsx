"use client"

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";
import { Logo } from "./logo";

export const Navbar = () => {
  const navigationItems = [
    { title: "Services", href: "/services" },
    { title: "About Us", href: "/about" },
    { title: "Contact Us", href: "/contact" },
  ];

  const [isOpen, setOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
        background: "backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/15 to-white/10",
        marginTop: "mt-8",
      };
    }
    // First scroll threshold
    else if (scrollPosition < 150) {
      return {
        height: "h-16",
        background: "backdrop-blur-xl bg-gradient-to-r from-white/15 via-white/20 to-white/15",
        marginTop: "mt-4",
      };
    }
    // Further scrolling
    else {
      return {
        height: "h-16",
        background: "backdrop-blur-xl bg-gradient-to-r from-white/20 via-white/25 to-white/20",
        marginTop: "mt-2",
      };
    }
  };

  const { height, background, marginTop } = getNavbarStyle();

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-transparent">
      <div 
        className={`mx-15 px-4 md:px-6 lg:px-8 ${marginTop} rounded-2xl ${background} text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-500 ease-in-out border border-white/10 hover:border-white/20`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
                className="text-white/90 text-sm font-medium px-3 py-2 rounded-lg hover:text-white transition-all duration-300 relative group"
              >
                {item.title}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300 delay-75"></span>
              </Link>
            ))}
            <Link
              to="/auth"
              className="text-white font-medium px-6 py-2.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-2 group"
            >
              <span className="relative">
                Sign in
                <Sparkles className="w-4 h-4 absolute -top-2 -right-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
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
          <div className="lg:hidden w-full px-4 py-4 space-y-2 rounded-b-2xl border-t border-white/10 bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-xl animate-slideDown">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="block text-white/90 text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-300 hover:translate-x-2"
              >
                {item.title}
              </Link>
            ))}
            <Link
              to="/auth"
              className="block text-white font-medium px-4 py-3 mt-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 rounded-lg transition-all duration-300 text-center hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};