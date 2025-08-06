import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { Button } from "../ui/Button"; // Changed to NAMED import for Button
import {
  Leaf,
  Menu,
  X,
  ArrowRight,
  Search,
  User,
  ShoppingCart,
  Home,
  Package,
  BookOpen,
  Star,
  Info,
  Phone,
} from "lucide-react"; // Added Search and User icons

function Header() {
  // Corrected state variable name from setIsMobileMobileMenuOpen to setIsMobileMenuOpen for consistency
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // This function is now primarily for *in-page* scrolling, if any sections on the HOME page
  // are still intended to be scrolled to from the header (e.g., if "Benefits" is part of HomePage)
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false); // Close mobile menu after scrolling
    } else {
      console.warn(
        `Section with ID '${sectionId}' not found on the current page. Ensure this ID exists or convert to a <Link> if it's a separate page.`
      );
      // If a scroll target is on a different page, you'd need to navigate first, then scroll.
      // E.g., history.push('/target-page#section-id'); and handle scrolling in target-page's useEffect.
    }
  };

  // Effect to handle body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling on body
    } else {
      document.body.style.overflow = ""; // Allow scrolling
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // // Function to calculate cart item count from localStorage
  // const updateCartCount = () => {
  //   const savedCart = localStorage.getItem("cart");
  //   if (savedCart) {
  //     const items = JSON.parse(savedCart);
  //     // Summing up quantities for all unique items in the cart
  //     const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  //     setCartItemCount(totalCount);
  //   } else {
  //     setCartItemCount(0);
  //   }
  // };

  // useEffect(() => {
  //   // Initial load of cart count
  //   updateCartCount();

  //   // Listen for custom 'cartUpdated' event from other components (like ProductsPage)
  //   // This is crucial for cross-component communication when localStorage changes.
  //   window.addEventListener("cartUpdated", updateCartCount);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("cartUpdated", updateCartCount);
  //   };
  // }, []);



// ⭐ Function to fetch cart item count from backend API
  const fetchCartCount = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setCartItemCount(0); // If not logged in, cart count is 0
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid, clear token and set count to 0
        localStorage.removeItem('authToken');
        setCartItemCount(0);
        // Optionally, navigate to login or show a message
        // navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch cart count.');
      }

      const data = await response.json();
      // Calculate total quantity from the items array returned by the backend
      const totalCount = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalCount);

    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartItemCount(0); // Set count to 0 on error
    }
  };

  // ⭐ Initial load and listener for cart count
  useEffect(() => {
    fetchCartCount(); // Fetch count on component mount

    // Listen for custom 'cartUpdated' event from other components
    // This event should be dispatched whenever the cart changes (add, update, remove)
    window.addEventListener("cartUpdated", fetchCartCount);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount




  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <Link to="/" className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2 border-2 border-amber-800 rounded-full px-3 py-1 shadow-sm">
          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-md">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-800 to-green-900 bg-clip-text text-transparent">
            The Good Soil Co.
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="ml-auto hidden md:flex gap-6 items-center">
        {/* Products */}
        <Link
          to="/productpage"
          className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-green-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
        >
          Products
        </Link>
        {/* About */}
        <Link
          to="/about"
          className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-green-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
        >
          About
        </Link>
        {/* Blog */}
        <Link
          to="/blog"
          className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-green-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
        >
          Blog
        </Link>
        {/* Reviews */}
        <Link
          to="/reviews"
          className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-green-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
        >
          Reviews
        </Link>
        {/* Contact */}
        <Link
          to="/contact"
          className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-green-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
        >
          Contact
        </Link>
        {/* Search Icon */}
        <Link
          to="/search"
          className="text-gray-600 hover:text-green-700 transition-colors p-2 rounded-full hover:bg-green-50"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Link>
        {/* Cart Icon */}
        <Link
          to="/cart"
          className="text-gray-600 hover:text-green-700 transition-colors relative"
        >
          <ShoppingCart className="h-6 w-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
              {cartItemCount}
            </span>
          )}
        </Link>
        {/* User Icon - directs to account page */}
        <Link
          to="/accountpage"
          className="text-gray-600 hover:text-green-700 transition-colors p-2 rounded-full hover:bg-green-50"
        >
          <User className="h-5 w-5" />
          <span className="sr-only">User Account</span>
        </Link>
      </nav>

      {/* Shop Now Button (Desktop) */}
      <Button
        asChild
        className="ml-4 bg-amber-200 hover:bg-amber-300 text-amber-900 shadow-md hover:shadow-lg transition-all duration-200 hidden md:inline-flex"
      >
        <Link to="/productpage">Shop Now</Link>
      </Button>

      {/* Mobile Menu Button (Hamburger/X icon) */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden ml-auto z-50 relative" // Ensure button is above overlay
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Corrected function call
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {/* Mobile Menu Overlay (Sidebar) */}
      {isMobileMenuOpen && (
        // Changed `bg-white/95` to `bg-white` for a solid background
        // Adjusted padding from p-8 to px-6 to give more horizontal space for content
        <div className="fixed inset-y-0 left-0 w-3/4 sm:w-1/2 max-w-xs h-screen bg-white z-40 flex flex-col items-start animate-in slide-in-from-left-full duration-300 px-6 py-16 shadow-lg">
          {" "}
          {/* Adjusted px and py */}
          {/* Close button inside the overlay, top right of the sidebar */}
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-green-700 focus:outline-none p-2"
            onClick={() => setIsMobileMenuOpen(false)} // Corrected function call
            aria-label="Close mobile menu"
          >
            {/* <X className="h-8 w-8" /> Larger X for easy tapping */}
          </button>
          <nav className="flex flex-col gap-4 text-left w-full">
            <Link
              to="/"
              className="text-xl font-medium text-green-900 hover:text-green-700 transition-colors flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-6 w-6" /> Home
            </Link>
            <Link
              to="/productpage"
              className="text-xl font-medium text-green-900 hover:text-green-700 transition-colors flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Package className="h-6 w-6" /> Products
            </Link>

            <Link
              to="/about"
              className="text-xl font-medium text-green-900 hover:text-green-700 transition-colors flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Info className="h-6 w-6" /> About
            </Link>
            <Link
              to="/blog"
              className="text-xl font-medium text-green-900 hover:text-green-700 transition-colors flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="h-6 w-6" /> Blog
            </Link>
            <Link
              to="/reviews"
              className="text-xl font-medium text-green-900 hover:text-green-700 transition-colors flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Star className="h-6 w-6" /> Reviews
            </Link>
            <Link
              to="/contact"
              className="text-xl font-medium text-green-900 hover:text-green-700 transition-colors flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Phone className="h-6 w-6" /> Contact
            </Link>

            {/* Icons with text for mobile, now aligned left within their parent */}
            <Link
              to="/search"
              className="text-xl font-medium text-green-900 hover:text-green-700 transition-colors flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Search className="h-6 w-6" /> Search
            </Link>

            <Link
              to="/cart"
              className="text-xl font-medium text-green-900 hover:text-green-700 transition-colors flex items-center gap-2 relative"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShoppingCart className="h-6 w-6" /> Cart
              {cartItemCount > 0 && (
                // Simplified positioning of cart count
                <span className="absolute -top-1 right-0 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white translate-x-1/2 -translate-y-1/2">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link
              to="/accountpage"
              className="text-xl font-medium text-green-900 hover:text-green-700 transition-colors flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="h-6 w-6" /> Account
            </Link>
          </nav>
          {/* Mobile Shop Now Button, now aligned left with the links */}
          <Button
            asChild
            className="mt-8 bg-amber-200 hover:bg-amber-300 text-amber-900 w-fit px-8 py-3 text-lg self-start"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Link to="/productpage">Shop Now</Link>
          </Button>
        </div>
      )}
    </header>
  );
}

export default Header;
