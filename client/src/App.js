import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BlogPage from "./pages/BlogPage";
import About from "./pages/About";
import CheckOutPage from "./pages/CheckOutPage";
import ReviewsPage from "./pages/ReviewsPage";
import ContactPage from "./pages/ContactPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ShippingInfo from "./pages/ShippingInfo";
import SustainabilityPage from "./pages/SustainabilityPage";
import GardenPlannerPage from "./pages/GardenPlannerPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsCondition from "./pages/TermsCondition";
import Search from "./pages/Search";
import FAQPage from './pages/FAQPage'

// Import common components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import './styles/index.css'
import SingleProductPage from "./pages/SingleProductPage";
import SingleArticlePage from "./pages/SingleArticlePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Global header */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Define other routes here */}
          <Route path="/accountpage" element={<AccountPage />} />
          <Route path="/productpage" element={<ProductPage />} />
          <Route path="/products/:id" element={<SingleProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route
            path="/orderconfirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="/orderhistory" element={<OrderHistoryPage />} />
          <Route
            path="/order-details/:orderId"
            element={<OrderDetailsPage />}
          />
          <Route path="/blog/:id" element={<SingleArticlePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/gardenplanner" element={<GardenPlannerPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsCondition />} />
          <Route path="/search" element={<Search />} />
          <Route path="/edit-profile" element={<ProfileEditPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </main>
      <Footer /> {/* Global footer */}
    </div>
  );
}

export default App;
