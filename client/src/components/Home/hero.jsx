import { MoveRight } from "lucide-react"
import { Button } from "@/components/ui/button";

export const Hero = () => (
  <div 
    className="min-h-screen w-screen flex items-center justify-center py-16 sm:py-24 md:py-32 bg-cover bg-center relative"
    style={{
      backgroundImage: "url('/bg-car.jpg')",
    }}
  >
    {/* Optional overlay for better text readability on various backgrounds */}
    <div className="absolute inset-0 bg-black/30"></div>
    
    <div className="container relative z-10 mx-auto text-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 max-w-7xl">
      {/* Text Section */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tighter mb-4 text-white">
      Fuel and parts to keep you moving
      </h1>
      <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-gray-200 mb-6 max-w-3xl mx-auto">
        Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever.
      </p>
      <Button size="lg" className="gap-2 sm:gap-3 mx-auto text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6">
        Sign up here <MoveRight className="w-3 h-3 sm:w-4 sm:h-4" />
      </Button>
    </div>
  </div>
);