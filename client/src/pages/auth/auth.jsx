import AuthBody from "@/components/auth/body";
import { Navbar } from "@/components/auth/navbar"

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Car background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1500&q=80" 
          alt="Car background" 
          className="w-full h-full object-cover object-center fixed top-0 left-0 min-h-screen min-w-full blur-sm" 
          style={{zIndex: 0, opacity: 0.55}}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-white/5 to-white/60" style={{zIndex: 1}}></div>
      </div>
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent z-10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent z-10"></div>
      
      <Navbar />
      <div className="mt-35 md:mt-23 lg:mt-4 px-4 sm:px-6 lg:px-8 relative z-20">
        <AuthBody />
      </div>
    </div>
  );
};

export default Auth;
