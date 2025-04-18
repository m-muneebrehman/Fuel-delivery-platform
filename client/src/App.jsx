import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/auth";
import { useAppStore } from "./store";
import Home from "./pages/home/home";
import PoAuth from "./pages/auth/petrol-owner/po-auth";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/auth/petrol-owner" element={<PoAuth />}></Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
