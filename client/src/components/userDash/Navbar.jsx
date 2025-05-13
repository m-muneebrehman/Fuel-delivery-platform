"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Fuel, Package, User } from "lucide-react"
import { Logo } from "../Home/logo";

export const Navbar = () => {
  const location = useLocation();
  
  const navigationItems = [
    { title: "Store", href: "/user/store", icon: ShoppingBag },
    { title: "Fuel Delivery", href: "/user/fuel", icon: Fuel },
    { title: "My Orders", href: "/user/orders", icon: Package },
    { title: "My Profile", href: "/user/profile", icon: User },
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
    if (scrollPosition < 50) {
      return {
        background: "bg-white/80 backdrop-blur-md",
        shadow: "shadow-sm",
      };
    } else {
      return {
        background: "bg-white/95 backdrop-blur-md",
        shadow: "shadow-md",
      };
    }
  };

  const { background, shadow } = getNavbarStyle();

  return (
    <header className={`w-full ${background} ${shadow} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};