import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/auth";
import { useAppStore } from "./store";
import Home from "./pages/home/home";
import PoAuth from "./pages/auth/petrol-owner/po-auth";
import ThemeContextProvider from '@/context/ThemeContextProvider';
import OwnerDashboard from "./pages/owner/dashboard";
import DeliveryBoyManagement from "./pages/owner/settings";
import UserAuth from "./pages/auth/user/user-auth";
import UserDashboard from "./pages/user/dashboard";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <ThemeContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/auth/petrol-owner" element={<PoAuth />}></Route>
        <Route path="/petrol-owner/dashboard" element={<OwnerDashboard />}></Route>
        <Route path="/petrol-owner/settings" element={<DeliveryBoyManagement />}></Route>
        <Route path="/auth/user" element={<UserAuth />}></Route>
        <Route path="/user/dashboard" element={<UserDashboard />}></Route>
      </Routes>
    </BrowserRouter>
    </ThemeContextProvider>
  );
};

export default App;
