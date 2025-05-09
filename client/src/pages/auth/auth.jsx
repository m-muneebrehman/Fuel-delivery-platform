import AuthBody from "@/components/auth/body";
import { Navbar } from "@/components/auth/navbar"

const Auth = () => {
  return (
    <div>
      <Navbar />
      <div className="mt-35 md:mt-23 lg:mt-4 px-4 sm:px-6 lg:px-8">
        <AuthBody />
      </div>
    </div>
  );
};

export default Auth;
