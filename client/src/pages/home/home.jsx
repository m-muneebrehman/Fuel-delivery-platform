import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Home/navbar";
import { Hero } from "@/components/Home/hero";
import { Feature } from "@/components/Home/feature";

function Home() {
  // eslint-disable-next-line no-unused-vars
  const [isScrolled, setIsScrolled] = useState(false);

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
      <Hero />

      <div>
        <Feature />
      </div>
    </div>
  );
}

export default Home;
