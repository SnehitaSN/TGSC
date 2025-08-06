import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  ArrowRight,
  ChevronDown,
  Calendar,
  User,
  Clock,
  Loader2, // Added for loading state
  XCircle,  // Added for error messages
} from "lucide-react";

// Updated Mock data for the blog categories - now includes status for articles
const blogCategories = [
  {
    name: "Urban Gardening",
    articles: [
      { title: "Small Space Growing Tips", status: "available", matchingPostId: 1 }, // Assuming ID 1 matches this
      { title: "Balcony Garden Setup", status: "coming_soon" },
      { title: "Container Gardening Basics", status: "available", matchingPostId: 4 }, // Assuming ID 4 matches this
    ],
  },
  {
    name: "Plant Nutrition",
    articles: [
      { title: "Understanding NPK Ratios", status: "available", matchingPostId: 5 }, // Assuming ID 5 matches this
      { title: "Organic vs Synthetic Fertilizers", status: "coming_soon" },
      { title: "Micronutrient Deficiencies", status: "coming_soon" },
    ],
  },
  {
    name: "Soil Health",
    articles: [
      { title: "Building Living Soil", status: "available", matchingPostId: 2 }, // Assuming ID 2 matches this
      { title: "Composting for Beginners", status: "available", matchingPostId: 3 }, // Assuming ID 3 matches this
      { title: "Soil Testing Guide", status: "coming_soon" },
    ],
  },
  {
    name: "Seasonal Care",
    articles: [
      { title: "Spring Garden Prep", status: "available", matchingPostId: 6 }, // Assuming ID 6 matches this
      { title: "Summer Plant Care", status: "coming_soon" },
      { title: "Winter Plant Protection", status: "coming_soon" },
    ],
  },
];

function BlogPage() {
  const [openCategory, setOpenCategory] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/blog_posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
        setError("Failed to load blog posts. Please ensure the backend server is running and accessible.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const toggleCategory = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-green-700" />
        <p className="text-xl text-green-800">Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
        <XCircle className="mr-2 h-8 w-8 text-red-600" />
        <p className="text-xl text-red-600 text-center mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 text-white mt-4">
          Retry Loading Blog Posts
        </Button>
      </div>
    );
  }

  // If no blog posts are found after loading, display a message
  if (blogPosts.length === 0 && !loading && !error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <p className="text-xl text-green-800 mb-4">No blog posts found. Please add posts to your database.</p>
        <p className="text-md text-green-700 text-center">Ensure your backend server is running and your database tables are populated.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section - Blog */}
        <section className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
            Our Blog
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-green-950 mt-4 leading-tight">
            Cultivate Your Knowledge
          </h1>
          <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
            Explore expert gardening tips, in-depth guides, and the latest insights to help your plants thrive.
          </p>
        </section>

        {/* Blog Content Section */}
        <section className="w-full py-8">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
              {/* Left Sidebar with Dropdown Categories */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-green-950 mb-4">Explore Categories</h3>
                <div className="space-y-3">
                  {blogCategories.map((category) => (
                    <Card key={category.name} className="border-green-200 rounded-xl overflow-hidden shadow-sm bg-white/80 backdrop-blur-sm">
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-green-50 transition-colors duration-200"
                      >
                        <span className="font-semibold text-lg text-green-900">{category.name}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-green-600 transition-transform duration-300 ${
                            openCategory === category.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openCategory === category.name && (
                        <div className="border-t border-green-200 bg-green-50/50 py-2">
                          {category.articles.map((article, index) => (
                            <div key={index} className="flex items-center justify-between px-4 py-2.5">
                              {article.status === "available" ? (
                                <Link
                                  to={`/blog/${article.matchingPostId}`} // Link to the specific blog post ID
                                  className="text-base text-green-800 hover:text-green-700 hover:bg-green-100 transition-colors duration-200 flex-grow"
                                >
                                  {article.title}
                                </Link>
                              ) : (
                                <span className="text-base text-gray-600 flex-grow">
                                  {article.title}
                                </span>
                              )}
                              {article.status === "coming_soon" && (
                                <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                  Coming Soon
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right Grid of Blog Articles */}
              <div className="grid gap-8 md:grid-cols-2">
                {blogPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
                  >
                    <CardContent className="p-0">
                      <img
                        src={post.image_url || "https://placehold.co/400x200/cccccc/333333?text=Blog+Image"} // Use image_url
                        width={400}
                        height={200}
                        alt={post.title}
                        className="w-full h-56 object-cover rounded-t-xl shadow-inner"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/cccccc/333333?text=Blog+Image"; }}
                      />
                      <div className="p-6">
                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 mb-4 py-1 px-3 shadow-sm">
                          {post.category}
                        </Badge>
                        <h3 className="text-xl font-bold text-green-950 mb-3 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-green-800 text-sm mb-5 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-green-700 mb-4 font-medium">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(post.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.read_time}</span>
                          </div>
                        </div>
                        {post.status === 'available' ? (
                          <Link to={`/blog/${post.id}`}>
                            <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 py-2.5 rounded-lg">
                              Read More
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Badge className="w-full bg-gray-200 text-gray-700 py-2.5 px-4 text-center flex items-center justify-center gap-2">
                            <Clock className="h-4 w-4" /> Coming Soon!
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action at the bottom */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-green-950 mb-4">Ready to Grow Your Best Garden Yet?</h2>
          <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
            Explore our range of organic solutions and join our community of sustainable gardeners.
          </p>
          <Link to="/productpage">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Shop Our Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;

