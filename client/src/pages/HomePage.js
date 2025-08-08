// HomePage.js
"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Corrected import paths for UI components (capitalized filenames)
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  Leaf,
  Sprout,
  Shield,
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Calendar,
  User,
  Clock,
  Menu, // Added for mobile menu
  X, // Added for mobile menu close
  ShoppingCart, // Added for product buttons
} from "lucide-react";
import Garden from "../assets/product-images/garden.jpg";
import CompostR from "../assets/product-images/CompostR.JPG";
import OrganicGarden from "../assets/product-images/OrganicGarden.JPG";
import NPK from "../assets/product-images/NPK.jpg";
import { motion } from "framer-motion";
// The hero image will be referenced directly from the public folder.
// No import statement needed for images placed in the public directory
// import heroImage from '../assets/images/ChatGPT Image Jun 26, 2025, 11_48_48 AM.png';


// ⭐ Define the dynamic backend URL
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Mock data for the blog categories and posts
const blogCategories = [
  {
    name: "Urban Gardening",
    articles: [
      "Small Space Growing Tips",
      "Balcony Garden Setup",
      "Container Gardening Basics",
    ],
  },
  {
    name: "Plant Nutrition",
    articles: [
      "Understanding NPK Ratios",
      "Organic vs Synthetic Fertilizers",
      "Micronutrient Deficiencies",
    ],
  },
  {
    name: "Soil Health",
    articles: [
      "Building Living Soil",
      "Composting for Beginners",
      "Soil Testing Guide",
    ],
  },
  {
    name: "Seasonal Care",
    articles: [
      "Spring Garden Prep",
      "Summer Plant Care",
      "Winter Plant Protection",
    ],
  },
];

// Mock Product Data for HomePage consistency with ProductsPage
const homePageProducts = [
  {
    id: 1,
    name: "Organic Gardening Kit",
    price: 1150,
    description:
      "A foundational blend of beneficial microbes and nutrients for vibrant growth in all plants.",
    image: OrganicGarden,
    category: "All-Purpose",
    inStock: true,
    rating: 5, // Added rating
  },
  {
    id: 2,
    name: "Compost-R",
    price: 500,
    description:
      "Formulated to promote prolific and colorful blooms for all flowering plants.",
    image: CompostR,
    category: "Composting", // This category will now be visible
    inStock: true,
    rating: 4, // Added rating
  },
  {
    id: 3,
    name: "Essential NKP Combo",
    price: 800,
    description:
      "Gentle yet effective nutrients to keep your houseplants lush and healthy year-round.",
    image: NPK,
    category: "Fertilizer",
    inStock: true,
    rating: 5, // Added rating
  },
];

// Mock Testimonial Data (copied from ReviewsPage.js to be available on homepage)
const testimonials = [
  {
    id: 1,
    rating: 5,
    quote:
      "My balcony tomatoes have never been more productive! The Good Soil Co. fertilizer transformed my small urban garden into a thriving food source. I'm absolutely thrilled with the results!",
    author: "Yogita B.",
    location: "Bidar,Karnataka",
  },
  {
    id: 2,
    rating: 5,
    quote:
      "As a beginner gardener, I was amazed at how easy it was to use and how quickly I saw results. My herbs are thriving and taste incredible! Highly recommend this to anyone starting out.",
    author: "Akhila M.",
    location: "Hyderabad, Telengana",
  },
  {
    id: 3,
    rating: 5,
    quote:
      "Finally, a fertilizer that's safe for my kids and pets but still delivers professional results. My indoor plants have never looked better and are so much healthier than before!",
    author: "Maithili.",
    location: "Bangalore, Karnataka",
  },
  {
    id: 4,
    rating: 5,
    quote:
      "I've tried many organic fertilizers, but The Good Soil Co. products are truly superior. My vegetables are larger, healthier, and the soil quality has visibly improved.",
    author: "Robert P.",
    location: "Austin, TX",
  },
  {
    id: 5,
    rating: 4,
    quote:
      "Great product for my potted flowers. They're blooming more vibrantly. The only reason for 4 stars is that I wish there were larger pack sizes available.",
    author: "Maria K.",
    location: "Miami, FL",
  },
  {
    id: 6,
    rating: 5,
    quote:
      "The indoor plant elixir is a game-changer! My fiddle leaf fig, which was struggling, has new growth and looks fantastic. Easy to use and effective.",
    author: "Chris T.",
    location: "Seattle, WA",
  },
];

export default function LandingPage() {
  const [openCategory, setOpenCategory] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState(homePageProducts); // Initialize with mock data
  const [blogPosts, setBlogPosts] = useState([]); // Initialize as empty array
  const navigate = useNavigate();

  // State for CTA form
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  // New states for product showcase loading/errors/add to cart feedback
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null); // Tracks which product is being added
  const [cartMessage, setCartMessage] = useState({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    // Fetch products for the homepage showcase
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setProductsError(null);
      try {
        const response = await fetch(`${backendUrl}/api/products_s`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Limit to 3 products for the homepage showcase
        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching products for homepage:", error);
        setProductsError(
          "Failed to load products. Please check server connection."
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    // Fetch blog posts (products fetching removed as per request)
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/blog_posts`); // Assuming your backend runs on port 5000
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchBlogPosts();
  }, []);

  const toggleCategory = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
    } else {
      console.warn(`Section with ID '${sectionId}' not found on this page.`);
    }
  };

  // Effect to handle body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // ⭐ UPDATED: handleAddToCart to use backend API
  const handleAddToCart = async (productId, productName) => {
    setAddingToCart(productId); // Set loading state for this specific product
    setCartMessage({ show: false, type: '', message: '' }); // Clear previous messages

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setCartMessage({ show: true, type: 'error', message: 'You must be logged in to add items to cart.' });
      setAddingToCart(null);
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId: productId, quantity: 1 }), // Always add 1 from homepage
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken'); // Clear expired/invalid token
        setCartMessage({ show: true, type: 'error', message: 'Your session has expired. Please log in again.' });
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart.');
      }

      const data = await response.json();
      setCartMessage({ show: true, type: 'success', message: data.message || `"${productName}" added to cart!` });

      // ⭐ Dispatch a custom event to notify Header and CartPage to update their counts/data
      window.dispatchEvent(new Event('cartUpdated'));

    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartMessage({ show: true, type: 'error', message: err.message || 'Error adding item to cart.' });
    } finally {
      setAddingToCart(null); // Reset loading state
      setTimeout(() => setCartMessage({ show: false, type: '', message: '' }), 3000); // Hide message after 3 seconds
    }
  };

  const handleBuyNow = (product) => {
    console.log(`Initiating direct purchase for product ${product.id}!`);
    // Pass product details for direct purchase
    navigate(
      `/checkout?productId=${product.id}&quantity=1&price=${product.price}`
    );
  };

  // Handle CTA form submission
  const handleCtaSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage(""); // Clear previous messages
    setMessageType("");

    // Basic client-side email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/subscribe-discount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");
        setEmail(""); // Clear email input on success
      } else {
        setMessage(data.message || "Something went wrong. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setMessage("Network error. Please try again later.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
    setEmail(""); // Clear email input on success
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-green-100 font-inter">
      {" "}
      {/* Changed to green gradient */}
      <main className="flex-1">
        {/* Amazon Availability Section - MOVED TO TOP */}
        <section className="w-full py-4 bg-white">
          <div className="container mx-auto px-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-green-900 text-lg font-medium flex justify-center items-center gap-2 flex-wrap"
            >
              Products also available on{" "}
              <motion.a
                href="https://www.amazon.in/Good-Soil-Co-Organic-Gardening/dp/B0DWG4R3RL"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1"
              >
                <motion.img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                  alt="Amazon"
                  className="h-6"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                />
              </motion.a>
            </motion.p>
          </div>
        </section>

        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-green-600/10 to-green-600/10 opacity-70" />{" "}
          {/* Changed to green gradient */}
          <div className="container px-4 md:px-6 relative mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 hover:from-green-200 hover:to-green-300 w-fit mx-auto lg:mx-0 py-1.5 px-4 text-base shadow-sm">
                    {" "}
                    {/* Changed to green gradient */}
                    Premium Microbial-Based Nutrition
                  </Badge>
                  <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl xl:text-7xl/none text-green-950 leading-tight">
                    Grow Extraordinary Plants with{" "}
                    <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                      {" "}
                      {/* Changed to green gradient */}
                      Living Soil
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-green-800 md:text-xl leading-relaxed mx-auto lg:mx-0">
                    {" "}
                    {/* Changed text color */}
                    Premium organic microbial fertilizers that transform your
                    urban garden into a thriving ecosystem. Scientifically
                    formulated for maximum plant health and sustainable growth.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to={"/productpage"}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {" "}
                      {/* Changed to green gradient */}
                      Shop Our Products
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to={"/gardenplanner"}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-green-600 text-green-600 hover:bg-green-50 text-lg py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-green-400 text-green-400"
                      />
                    ))}
                  </div>
                  <span className="text-base text-green-800 font-medium">
                    4.9/5 from 2,000+ urban gardeners
                  </span>{" "}
                  {/* Changed text color */}
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[450px] aspect-[4/5]">
                  <img
                    src={Garden} // Corrected path for image from public folder
                    width={450}
                    height={562}
                    alt="Hand planting seeds in healthy soil, representing organic growth."
                    className="w-full h-full object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500 border-4 border-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/400x500/84cc16/dcfce7?text=Error+Loading+Image";
                    }}
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-green-100 transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                      <Sprout className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="text-lg font-semibold text-green-950">
                          Only Products with
                        </div>
                        <div className="text-sm text-green-700">
                          Guranteed Cell Count
                        </div>{" "}
                        {/* Changed text color */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="benefits"
          className="w-full py-12 md:py-24 lg:py-32 bg-white"
        >
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm">
                {" "}
                {/* Changed to green gradient */}
                Why Choose Good Soil Co.
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-green-950">
                Science-Backed Plant Nutrition for Your Home Garden
              </h2>
              <p className="max-w-[900px] text-green-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {" "}
                {/* Changed text color */}
                Our premium Microbial-based fertilizers are formulated with
                beneficial microorganisms that create a living soil ecosystem,
                delivering nutrients exactly when your plants need them for
                optimal growth and vitality.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="border-green-200 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-green-50/50">
                <CardContent className="flex flex-col items-center space-y-5 p-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md">
                    <Leaf className="h-7 w-7 text-green-700" />
                  </div>
                  <h3 className="text-xl font-bold text-green-950">
                    100% Organic & Natural
                  </h3>
                  <p className="text-center text-green-800 leading-relaxed">
                    {" "}
                    {/* Changed text color */}
                    Crafted from the finest organic materials, free from
                    synthetic chemicals. Safe for your family, beloved pets, and
                    the delicate ecosystem of your garden.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-green-200 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-green-50/50">
                <CardContent className="flex flex-col items-center space-y-5 p-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md">
                    {" "}
                    {/* Changed to green gradient */}
                    <Shield className="h-7 w-7 text-green-700" />
                  </div>
                  <h3 className="text-xl font-bold text-green-950">
                    Optimized for Urban Growth
                  </h3>
                  <p className="text-center text-green-800 leading-relaxed">
                    {" "}
                    {/* Changed text color */}
                    Our unique formulas are specially designed for the unique
                    challenges of container gardening, thriving balcony spaces,
                    and all indoor growing environments.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-green-200 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-green-50/50">
                {" "}
                {/* Changed border and background */}
                <CardContent className="flex flex-col items-center space-y-5 p-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md">
                    {" "}
                    {/* Changed to green gradient */}
                    <Sprout className="h-7 w-7 text-green-700" />
                  </div>
                  <h3 className="text-xl font-bold text-green-950">
                    Vibrant Living Microbes
                  </h3>{" "}
                  {/* Changed text color */}
                  <p className="text-center text-green-800 leading-relaxed">
                    Packed with billions of beneficial microorganisms that work
                    in harmony with your plants, significantly enhancing
                    nutrient uptake and enriching overall soil health.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Product Showcase */}
        <section
          id="products"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-green-100"
        >
          {" "}
          {/* Changed to green gradient */}
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
                {" "}
                {/* Changed to green gradient */}
                Our Premium Product Line
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-green-950">
                {" "}
                {/* Changed text color */}
                Complete Plant Nutrition System for Every Gardener
              </h2>
              <p className="max-w-[900px] text-green-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our range of specialized organic fertilizers, each
                crafted to meet the specific needs of your plants, from vibrant
                vegetables to lush indoor greenery.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {products.map((product) => {
                // Ensure product.price is a valid number before calling toFixed()
                const displayPrice = Number(product.price) || 0;

                return (
                  <Card
                    key={product.id}
                    className="border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/70 backdrop-blur-sm"
                  >
                    <CardContent className="p-0">
                      <Link to={`/products/${product.id}`}>
                        {" "}
                        {/* Link to single product page */}
                        <img
                          src={
                            product.image ||
                            "https://placehold.co/400x250/cccccc/333333?text=Product+Image"
                          }
                          width={400}
                          height={250}
                          alt={product.name}
                          className="w-full h-56 object-cover rounded-t-xl shadow-inner"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/400x250/cccccc/333333?text=Product+Image";
                          }}
                        />
                      </Link>
                      <div className="p-6">
                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 mb-3 py-1 px-3 shadow-sm">
                          {" "}
                          {/* Changed to green gradient */}
                          {product.category}
                        </Badge>
                        <Link to={`/product/${product.id}`}>
                          {" "}
                          {/* Link to single product page */}
                          <h3 className="text-2xl font-bold text-green-950 mb-3">
                            {product.name}
                          </h3>
                        </Link>
                        {/* Star Rating for Products removed */}
                        <p className="text-green-800 mb-5 leading-relaxed">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-green-800">
                            {" "}
                            {/* Changed to green text */}₹
                            {displayPrice.toFixed(2)}{" "}
                            {/* Consistent currency and decimal places */}
                          </span>
                          <div className="flex gap-2">
                            {" "}
                            {/* Group buttons */}
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                              onClick={() =>
                                handleAddToCart(product.id, product.name)
                              }
                            >
                              <ShoppingCart className="h-4 w-4" /> Add
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                              onClick={() => handleBuyNow(product)}
                            >
                              <ArrowRight className="h-4 w-4" /> Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-20">
              <h2 className="text-3xl font-bold text-green-950 mb-4">
                Ready to Grow Your Best Garden Yet?
              </h2>
              <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
                Explore our full range of organic solutions and find the perfect
                nourishment for your plants.
              </p>
              <Link to={"/productpage"}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {" "}
                  {/* Changed to green gradient */}
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm">
                Growing Knowledge
              </Badge>{" "}
              {/* Changed to green gradient */}
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-green-950">
                Expert Gardening Tips & In-depth Guides
              </h2>
              <p className="max-w-[900px] text-green-800 md:text-xl/relaxed">
                {" "}
                {/* Changed text color */}
                Dive into our comprehensive collection of articles. Discover the
                latest insights, practical tips, and proven techniques from our
                gardening experts to help you cultivate your best garden yet.
              </p>
            </div>

            {/* Combined Blog Content */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {" "}
              {/* Adjusted grid for 3 cards */}
              {blogPosts
                .slice(0, 3)
                .map((post /* Only display first 3 posts */) => (
                  <Card
                    key={post.id}
                    className="border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/70 backdrop-blur-sm"
                  >
                    <CardContent className="p-0">
                      <img
                        src={
                         post.image_url||
                          "https://placehold.co/400x200/cccccc/333333?text=Blog+Image"
                        }
                        width={400}
                        height={200}
                        alt={post.title}
                        className="w-full h-56 object-cover rounded-t-xl shadow-inner"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/400x200/cccccc/333333?text=Blog+Image";
                        }}
                      />
                      <div className="p-6">
                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 mb-4 py-1 px-3 shadow-sm">
                          {" "}
                          {/* Changed to green gradient */}
                          {post.category}
                        </Badge>
                        <h3 className="text-xl font-bold text-green-950 mb-3 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-green-800 text-sm mb-5 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>{" "}
                        {/* Changed text color */}
                        <div className="flex items-center justify-between text-xs text-green-700 mb-4 font-medium">
                          {" "}
                          {/* Changed text color */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{post.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <Link to={`/blog/${post.id}`}>
                          {" "}
                          {/* Link for Read More button */}
                          <Button
                            variant="outline"
                            className="w-full border-green-600 text-green-600 hover:bg-green-50 py-2.5 rounded-lg"
                          >
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="text-center mt-16">
              <Link to={"/blog"}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-800 text-green-800 hover:bg-green-50 py-3 px-8 text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {" "}
                  {/* Changed to green border and text */}
                  View All Articles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials - Simplified on Landing Page, link to Reviews page */}
        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-green-100" // Changed to green gradient
        >
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm">
                {" "}
                {/* Changed to green gradient */}
                Customer Success Stories
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-green-950">
                {" "}
                {/* Changed text color */}
                Loved by Urban Gardeners Nationwide
              </h2>
              <p className="max-w-[900px] text-green-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear directly from our satisfied customers who have transformed
                their gardening experiences and achieved amazing results with
                Good Soil Co. products.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Display a few testimonials, then provide link to full Reviews page */}
              {testimonials.slice(0, 3).map(
                (
                  testimonial // Show only first 3 for brevity
                ) => (
                  <Card
                    key={testimonial.id}
                    className="border-green-200 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center gap-1 mb-5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-green-400 text-green-400"
                          />
                        ))}
                        {[...Array(5 - testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-gray-300"
                          /> /* Empty stars */
                        ))}
                      </div>
                      <p className="text-green-800 mb-6 leading-relaxed text-lg">
                        "{testimonial.quote.substring(0, 150)}..."{" "}
                        {/* Truncate for homepage */}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center text-lg shadow-sm">
                          {" "}
                          {/* Changed to green gradient */}
                          <span className="text-green-800 font-bold">
                            {testimonial.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-green-950 text-base">
                            {testimonial.author}
                          </div>
                          <div className="text-sm text-green-700">
                            {testimonial.location}
                          </div>{" "}
                          {/* Changed text color */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
            <div className="text-center mt-12">
              <Link to="/reviews">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-800 text-green-800 hover:bg-green-50 py-3 px-8 text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Read All Reviews
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-cover bg-center text-white relative overflow-hidden"
          style={{
            backgroundImage: `url('/assets/product-images/soil,jpg')`,
          }}
        >
          {" "}
          {/* Changed to background image directly from public folder */}
          <div
            className="absolute inset-0 bg-green-900/60"
            style={{
              backgroundImage: `url('/assets/product-images/soil,jpg')`,
            }}
          />{" "}
          {/* Overlay for text readability */}
          <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-white leading-tight">
                  Start Growing Better Today
                </h2>
                <p className="mx-auto max-w-[700px] text-green-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of urban gardeners who've transformed their
                  growing experience with our premium Microbalo-based
                  fertilizers. Get exclusive tips, offers, and support directly
                  in your inbox.
                </p>
              </div>
              <div className="w-full max-w-lg space-y-4">
                <form
                  className="flex flex-col sm:flex-row gap-3"
                  onSubmit={handleCtaSubmit}
                >
                  <Input
                    type="email"
                    placeholder="Enter your email for updates..."
                    className="flex-1 bg-white/15 border-white/30 text-white placeholder:text-green-100 py-2.5 px-4 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white py-2.5 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 font-semibold"
                    disabled={isSubmitting}
                  >
                    {" "}
                    {/* Adjusted button color */}
                    {isSubmitting ? "Subscribing..." : "Get 20% Off"}
                  </Button>
                </form>
                {message && (
                  <p
                    className={`text-sm ${
                      messageType === "success"
                        ? "text-green-200"
                        : "text-red-300"
                    }`}
                  >
                    {message}
                  </p>
                )}
                <p className="text-sm text-green-100">
                  Sign up now to receive exclusive growing tips and an instant
                  20% off your first order!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to={"/productpage"}>
                  <Button
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {" "}
                    {/* Adjusted button color */}
                    Shop All Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="w-full py-12 bg-gradient-to-r from-green-50 to-green-100">
          {" "}
          {/* Changed to green gradient */}
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
              <div className="flex flex-col items-center text-center p-4">
                <Award className="h-10 w-10 text-green-600 mb-3" />
                <div className="text-base font-semibold text-green-950">
                  OMRI Listed
                </div>
                <div className="text-sm text-green-700">
                  Certified Organic Purity
                </div>{" "}
                {/* Changed text color */}
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Shield className="h-10 w-10 text-green-800 mb-3" />{" "}
                {/* Changed icon color */}
                <div className="text-base font-semibold text-green-950">
                  Safe & Natural
                </div>{" "}
                {/* Changed text color */}
                <div className="text-sm text-green-700">
                  Pet & Kid Friendly Formula
                </div>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <CheckCircle className="h-10 w-10 text-green-600 mb-3" />
                <div className="text-base font-semibold text-green-950">
                  30-Day Guarantee
                </div>
                <div className="text-sm text-green-700">
                  Completely Risk-Free Trial
                </div>{" "}
                {/* Changed text color */}
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Sprout className="h-10 w-10 text-green-800 mb-3" />{" "}
                {/* Changed icon color */}
                <div className="text-base font-semibold text-green-950">
                  2000+ Reviews
                </div>{" "}
                {/* Changed text color */}
                <div className="text-sm text-green-700">
                  4.9/5 Average Rating
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
