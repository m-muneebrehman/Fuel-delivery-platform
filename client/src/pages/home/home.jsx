import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/Home/navbar";
import { Hero } from "@/components/ui/Home/hero";
import { Feature } from "@/components/ui/Home/feature";

function Home() {
  // eslint-disable-next-line no-unused-vars
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll and adjust state for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="bg-fixed bg-center bg-cover bg-black bg-opacity-50">
        <Navbar />
      </div>
      <div className="px-8 md:px-16 lg:px-40">
        <Hero />
      </div>

      <div>
        <Feature />
      </div>
    </div>
  );
}

export default Home;
