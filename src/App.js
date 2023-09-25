import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ProductInfo from "./pages/ProductInfo";
import RegisterPage from "./pages/RegisterPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPage from "./pages/AdminPage";
import HhohhoResults from "./pages/HhohhoResults";
import LubomboResults from "./pages/LubomboResults";
import ManziniResults from "./pages/ManziniResults";
import OrdersPage from "./pages/OrdersPage";

import Reports from "./pages/Reports";
import ResultPage from "./pages/ResultPage";
import ShiselweniResults from "./pages/ShiselweniResults";
import "./stylesheets/authentication.css";
import "./stylesheets/layout.css";
import "./stylesheets/products.css";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <ProtectedRoutes>
                <AdminPage />
              </ProtectedRoutes>
            }
          />
          <Route path="/login" exact element={<LoginPage />} />
          <Route path="/register" exact element={<RegisterPage />} />
          <Route
            path="/productInfo/:productid"
            exact
            element={
              <ProtectedRoutes>
                <ProductInfo />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/cart"
            exact
            element={
              <ProtectedRoutes>
                <CartPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/orders"
            exact
            element={
              <ProtectedRoutes>
                <OrdersPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/admin/"
            exact
            element={
              <ProtectedRoutes>
                <AdminPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/SHISELWENI"
            exact
            element={
              <ProtectedRoutes>
                <ShiselweniResults />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/HHOHHO"
            exact
            element={
              <ProtectedRoutes>
                <HhohhoResults />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/MANZINI"
            exact
            element={
              <ProtectedRoutes>
                <ManziniResults />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/LUBOMBO"
            exact
            element={
              <ProtectedRoutes>
                <LubomboResults />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/controller"
            exact
            element={
              <ProtectedRoutes>
                <ProductInfo />
              </ProtectedRoutes>
            }
          />


          <Route
            path="/results"
            exact
            element={
              <ProtectedRoutes>
                <ResultPage />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/REPORT"
            exact
            element={
              <ProtectedRoutes>
                <Reports />
              </ProtectedRoutes>
            }
          />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

export const ProtectedRoutes = ({ children }) => {
  if (localStorage.getItem("currentUser")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
