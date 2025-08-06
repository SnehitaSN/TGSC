import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Use Link from react-router-dom for navigation
import { Leaf, Facebook, Instagram, Youtube, Twitter } from "lucide-react"; // Import social media icons

function Footer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/products_s'); // Fetch products from your backend
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products for footer:", err);
        setError("Failed to load product links. Please check backend server and database.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Fetch products once on component mount

  // Define a mapping from product names in the footer to actual product IDs/names from backend
  // This is necessary because the footer has hardcoded names that might not exactly match backend data.
  // In a real application, you might fetch a simplified list for the footer or use product IDs directly.
  const footerProductMap = {
    "Organic Gardening Kit": { id: 1, name: "Organic Gardening Kit" },
    "Compost R": { id: 2, name: "Compost-R" }, // Note: Backend uses "Compost-R"
    "Essential NPK Combo": { id: 3, name: "Essential NPK Combo" },
    "Germinator +": { id: 6, name: "Germinator+ Combo Pack" }, // Note: Backend uses "Germinator+ Combo Pack"
    "Growell": { id: 4, name: "Growell" },
    "Flower Booster Kit": { id: 5, name: "Rose Kit" }, // Note: Backend uses "Rose Kit"
    "Fruit Booster Kit": { id: 8, name: "Fruit Booster Combo Pack" }, // Note: Backend uses "Fruit Booster Combo Pack"
  };

  return (
    <footer
      id="contact"
      className="flex flex-col gap-8 py-10 w-full shrink-0 items-center px-4 md:px-6 border-t bg-amber-950 shadow-inner"
    >
      <div className="container grid gap-10 md:grid-cols-4 mx-auto max-w-7xl">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-md">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-white">
              The Good Soil Co.
            </span>
          </div>
          <p className="text-sm text-amber-100 leading-relaxed">
            Dedicated to providing premium microbial fertilizers, empowering
            urban gardening enthusiasts to cultivate healthier, more vibrant
            plants sustainably.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-white mb-3">Products</h4>
          <nav className="flex flex-col space-y-2">
            {loading ? (
              <span className="text-sm text-amber-300">Loading products...</span>
            ) : error ? (
              <span className="text-sm text-red-300">{error}</span>
            ) : (
              Object.entries(footerProductMap).map(([footerName, { id: mappedId, name: backendName }]) => {
                // Find the actual product object from the fetched products
                const product = products.find(p => p.id === mappedId);
                if (product) {
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="text-sm text-amber-100 hover:text-amber-50 transition-colors hover:underline underline-offset-2"
                    >
                      {footerName} {/* Display the name as it appears in the footer */}
                    </Link>
                  );
                }
                // Fallback if product not found (e.g., ID mismatch or data missing)
                return (
                  <span key={footerName} className="text-sm text-amber-300 opacity-70 cursor-not-allowed">
                    {footerName} (Not available)
                  </span>
                );
              })
            )}
          </nav>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-white mb-3">Support</h4>
          <nav className="flex flex-col space-y-2">
            <Link
              to="/blog"
              className="text-sm text-amber-100 hover:text-amber-50 transition-colors hover:underline underline-offset-2"
            >
              Growing Guides
            </Link>
            <Link
              to="/faq"
              className="text-sm text-amber-100 hover:text-amber-50 transition-colors hover:underline underline-offset-2"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="text-sm text-amber-100 hover:text-amber-50 transition-colors hover:underline underline-offset-2"
            >
              Contact Us
            </Link>
            <Link
              to="/shipping"
              className="text-sm text-amber-100 hover:text-amber-50 transition-colors hover:underline underline-offset-2"
            >
              Shipping Info
            </Link>
          </nav>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-white mb-3">Company</h4>
          <nav className="flex flex-col space-y-2">
            <Link
              to="/about"
              className="text-sm text-amber-100 hover:text-amber-50 transition-colors hover:underline underline-offset-2"
            >
              About Us
            </Link>
            <Link
              to="/sustainability"
              className="text-sm text-amber-100 hover:text-amber-50 transition-colors hover:underline underline-offset-2"
            >
              Sustainability
            </Link>
            <Link
              to="/reviews"
              className="text-sm text-amber-100 hover:text-amber-50 transition-colors hover:underline underline-offset-2"
            >
              Reviews
            </Link>
          </nav>
        </div>
      </div>

      {/* Social Media Links section */}
      <div className="w-full flex flex-col items-center gap-2 mt-8">
        <h5 className="text-base font-semibold text-white">Follow Us</h5>
        <div className="flex gap-4">
          <a
            href="https://www.facebook.com/profile.php?id=61567642530482"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-400 transition-colors"
          >
            <Facebook className="h-6 w-6" />
            <span className="sr-only">Facebook</span>
          </a>
          <a
            href="https://www.instagram.com/thegoodsoil_co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-400 transition-colors"
          >
            <Instagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </a>
          <a
            href="https://www.youtube.com/@TheGoodSoilCo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-400 transition-colors"
          >
            <Youtube className="h-6 w-6" />
            <span className="sr-only">YouTube</span>
          </a>
          <a
            href="https://twitter.com/TheGoodSoilCo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-200 transition-colors"
          >
            <Twitter className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </a>
        </div>
      </div>

      <div className="w-full border-t border-amber-800 mt-8 pt-6">
        <div className="container flex flex-col sm:flex-row justify-between items-center mx-auto max-w-7xl text-center sm:text-left">
          <p className="text-xs text-amber-100">
            © {new Date().getFullYear()} The Good Soil Co. All rights reserved.
          </p>
          <nav className="flex gap-4 mt-4 sm:mt-0">
            <Link
              to="/privacy"
              className="text-xs text-amber-100 hover:text-amber-50 transition-colors hover:underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-amber-100 hover:text-amber-50 transition-colors hover:underline underline-offset-2"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
