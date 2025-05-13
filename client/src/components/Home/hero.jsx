import { MoveRight, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button";

export const Hero = () => (
  <div 
    className="min-h-screen w-screen flex items-center justify-center py-16 sm:py-24 md:py-32 bg-cover bg-center relative overflow-hidden"
    style={{
      backgroundImage: "url('/bg-car.jpg')",
    }}
  >
    {/* Enhanced overlay with animated gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 animate-gradient"></div>
    
    {/* Animated particles effect */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent animate-pulse"></div>
    
    <div className="container relative z-10 mx-auto text-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 max-w-7xl">
      {/* Enhanced Text Section with animations */}
      <div className="space-y-12">
        <div className="relative">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight text-white leading-[1.1]">
            <span className="block animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
              <span className="inline-block animate-gradient-x bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                Fuel and parts
              </span>
            </span>
            <span className="block mt-3 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.6s]">
              <span className="inline-block animate-gradient-x bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400">
                to keep you moving
              </span>
            </span>
          </h1>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-300"></div>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-wide text-gray-200 font-light">
            <span className="block animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:1s]">
              Managing a small business today is already tough.
            </span>
            <span className="block mt-2 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:1.4s] text-blue-300 font-normal">
              Avoid further complications by ditching outdated, tedious trade methods.
            </span>
            <span className="block mt-2 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:1.8s] text-white/90">
              Our goal is to streamline SMB trade, making it easier and faster than ever.
            </span>
          </p>
          {/* Decorative line */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-expand opacity-0 [animation-fill-mode:forwards] [animation-delay:2.2s]"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Button 
            size="lg" 
            className="group relative overflow-hidden gap-2 sm:gap-3 text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:2.4s]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sign up here
              <MoveRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <Sparkles className="w-4 h-4 absolute -top-2 -right-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </Button>

          <Button 
            size="lg" 
            variant="outline" 
            className="group gap-2 sm:gap-3 text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 border-2 text-white hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:2.6s]"
          >
            <span className="relative z-10">Learn more</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </Button>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
          {[
            { number: "24/7", label: "Service" },
            { number: "100+", label: "Locations" },
            { number: "10k+", label: "Customers" },
            { number: "99%", label: "Satisfaction" }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="text-center group animate-slide-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: `${2.8 + index * 0.2}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                {stat.number}
              </div>
              <div className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);