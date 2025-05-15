import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/auth";
import { useAppStore } from "./store";
import Home from "./pages/home/home";
import PoAuth from "./pages/auth/petrol-owner/poLogin";
import ThemeContextProvider from "@/context/ThemeContextProvider";
import OwnerDashboard from "./pages/owner/dashboard";
import DeliveryBoyManagement from "./pages/owner/settings";
import UserAuth from "./pages/auth/user/userLogin";
import UserDashboard from "./pages/user/dashboard";
import OrdersPage from "./components/userDash/orders";
import FuelDeliverySystem from "./components/userDash/fuel-deliver";
import UserProfile from "./components/userDash/profile";
import AdminHome from "./pages/admin/home";
import Notifications from "./pages/admin/notifications";
import UserSignUp from "./pages/auth/user/userSignUp";
import PoSignUp from "./pages/auth/petrol-owner/poSignUp";
import Store from "./pages/admin/Store";
import LoginDeliveryBoy from "./pages/deliveryBoy/dLogin";
import DeliveryBoyDashboard from "./pages/deliveryBoy/dDashboard";
import FuelPrices from "./pages/admin/FuelPrices";

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
          <Route path="/auth/petrol-owner/login" element={<PoAuth />}></Route>
          <Route path="/auth/petrol-owner/signup" element={<PoSignUp />}></Route>
          <Route
            path="/petrol-owner/dashboard"
            element={<OwnerDashboard />}
          ></Route>
          <Route
            path="/petrol-owner/settings"
            element={<DeliveryBoyManagement />}
          ></Route>
          <Route path="/auth/user/login" element={<UserAuth />}></Route>
          <Route path="/auth/user/signup" element={<UserSignUp />}></Route>
          <Route path="/user/*" element={<UserDashboard />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="store" element={<UserDashboard />} />
          </Route>
          <Route path="/user/orders" element={<OrdersPage />}></Route>
          <Route path="/user/fuel" element={<FuelDeliverySystem />}></Route>
          <Route path="/user/profile" element={<UserProfile />}></Route>
          <Route path="/admin" element={<AdminHome />}></Route>
          <Route path="/admin/store" element={<Store />}></Route>
          <Route path="/admin/fuel-prices" element={<FuelPrices />}></Route>
          <Route path="/admin/notifications" element={<Notifications />}></Route>
          <Route path="/deliveryBoy" element={<LoginDeliveryBoy />}></Route>
          <Route path="/deliveryBoy/dashboard" element={<DeliveryBoyDashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeContextProvider>
  );
};

export default App;