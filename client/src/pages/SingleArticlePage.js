import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ArrowLeft, Calendar, User, Clock, Sparkles } from "lucide-react";

export default function SingleArticlePage() {
  const { id } = useParams(); // Get article ID from URL parameters
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define API_URL here so it's accessible by all functions in the component
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog_posts/${id}`); // Fetch single article
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        console.error(`Failed to fetch article with ID ${id}:`, err);
        setError("Failed to load article details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, API_URL]); // Re-fetch if ID changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <p className="text-xl text-green-800">Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
        <p className="text-xl text-green-800 mb-4">Article not found.</p>
        <Link to="/blogpage">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 md:p-10">
        <img
          // src={article.image_url || "https://placehold.co/800x400/cccccc/333333?text=Article+Image"}
          src={`${API_URL}${article.image_url}`}
          alt={article.title}
          className="w-full max-h-80 object-cover rounded-lg shadow-md mb-8"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/800x400/cccccc/333333?text=Article+Image";
          }}
        />
        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 mb-4 py-1 px-3 shadow-sm inline-flex">
          {article.category}
        </Badge>
        <h1 className="text-4xl font-extrabold text-green-950 mb-4 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-6 text-sm text-green-700 mb-8 font-medium">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(article.publish_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{article.read_time}</span>
          </div>
        </div>
        <div className="prose prose-lg max-w-none text-green-800 leading-relaxed">
          {/* Render the full content of the article */}
          {/* <p>{article.content}</p> */}
          {/* You can add more detailed formatting here if your content supports Markdown or rich text */}
          {/* UPDATED LOGIC: 
            Splits the content by double newlines (\n\n) to create distinct blocks.
            It checks if a block is a heading, a list, or a paragraph and renders the correct semantic HTML for optimal spacing and readability.
          */}
          {article.content.split("\n\n").map((block, index) => {
            const trimmedBlock = block.trim();

            if (trimmedBlock === "") return null;

            // --- HEADING DETECTION (Heuristics) ---
            const isMainHeading =
              trimmedBlock.length < 70 &&
              !trimmedBlock.startsWith("*") &&
              !trimmedBlock.startsWith("-") &&
              !trimmedBlock.includes(":");
            const isSubSection =
              trimmedBlock.includes(":") &&
              trimmedBlock.length < 30 &&
              !trimmedBlock.startsWith("*");

            if (isMainHeading) {
              return (
                <h3
                  key={index}
                  className="text-xl font-semibold mt-6 mb-3 text-amber-800"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {trimmedBlock}
                </h3>
              );
            }

            if (isSubSection) {
              return (
                <h4
                  key={index}
                  className="text-xl font-medium mt-4 mb-2 text-amber-800"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {trimmedBlock}
                </h4>
              );
            }

            // --- LIST RENDERING WITH LEAF ICONS ---
            if (trimmedBlock.startsWith("*") || trimmedBlock.includes("\n*")) {
              const listItems = trimmedBlock
                .split("\n")
                .filter((item) => item.trim() !== "");

              return (
                // Container with margin and tighter vertical spacing
                <div key={index} className="my-4 space-y-2 text-green-800">
                  {listItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-2">
                      {/* CHANGE: Using Sparkles, larger size, and explicit fill color */}
                      <Sparkles className="mt-2 h-4 w-4 text-green-600 fill-green-600 flex-shrink-0" />
                      <div
                        className="flex-1" // Allows text to wrap nicely
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {item.replace(/^\*\s*/, "")}{" "}
                        {/* Clean the text content */}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // --- REGULAR PARAGRAPH ---
            return (
              <p
                key={index}
                className="mb-4"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {trimmedBlock}
              </p>
            );
          })}
        </div>
      </div>
      {/* NEW/MODIFIED PLACEMENT: Moved to end, centered, and improved styling */}
      <div className="max-w-6xl mx-auto mt-10 flex justify-center">
        <Link to="/blog" className="block">
          <Button
            variant="outline"
            // Increased size (px-6 py-3, text-lg) for better visibility and clickability
            className="border-green-600 text-green-700 hover:bg-green-50 px-6 py-3 text-lg transition-all"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to All Blog Posts
          </Button>
        </Link>
      </div>
    </div>
  );
}
