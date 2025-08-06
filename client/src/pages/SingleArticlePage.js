import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

export default function SingleArticlePage() {
  const { id } = useParams(); // Get article ID from URL parameters
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blog_posts/${id}`); // Fetch single article
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
  }, [id]); // Re-fetch if ID changes

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
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 md:p-10">
        <Link to="/blog" className="mb-6 block w-fit">
          <Button variant="outline" className="border-green-400 text-green-700 hover:bg-green-50">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog Posts
          </Button>
        </Link>
        <img
          src={article.image_url || "https://placehold.co/800x400/cccccc/333333?text=Article+Image"}
          alt={article.title}
          className="w-full h-auto object-cover rounded-lg shadow-md mb-8"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/cccccc/333333?text=Article+Image"; }}
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
            <span>{new Date(article.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{article.read_time}</span>
          </div>
        </div>
        <div className="prose prose-lg max-w-none text-green-800 leading-relaxed">
          {/* Render the full content of the article */}
          <p>{article.content}</p>
          {/* You can add more detailed formatting here if your content supports Markdown or rich text */}
        </div>
      </div>
    </div>
  );
}
