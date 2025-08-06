import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Star, ArrowRight, User } from 'lucide-react';

// Mock Testimonial Data (can be expanded)
const testimonials = [
  {
    id: 1,
    rating: 5,
    quote:"Okay, I don’t usually write reviews, but I HAD to for this one! I got The Good Soil Co.’s Organic Gardening Kit on Amazon a few weeks ago, and honestly, I wasn’t expecting such fast results. I used it on my tomato and money plant, and within two weeks, I saw a noticeable difference. My tomato plant, which had been looking weak for months, suddenly had fresh green leaves and stronger stems. The soil also felt richer and healthier. Super easy to use—just mix with water and pour. One pack makes 300L of organic plant food, so it’s going to last me a long time! And the best part? No chemicals, no weird smell, and completely organic. If you love your plants, this is 100% worth it! Will definitely be buying again.",
    author: "Srivalli Surabhi",
    location: "Hyderabad, Telengana",
  },
  {
    id: 2,
    rating: 5,
    quote: "The good soil co is very useful and helpful for growing of your plants as it is 100% organic which helps to grow plants naturally.",
    author: "Santhosh Madlur.",
    location: "Bangalore,Karnataka",
  },
  {
    id: 3,
    rating: 5,
    quote: "I recently tried Good Soil Kit, and I must say, it exceeded my expectations! Whether you're a beginner or a seasoned gardener, this kit provides everything you need to assess your soil’s health and ensure your plants get the best possible growing conditions. Got the results within 8 days.",
    author: "Sarita Kulkarni.",
    location: "Pune , Maharashtra",
  },
  {
    id: 4,
    rating: 5,
    quote: "I've tried many organic fertilizers, but The Good Soil Co. products are truly superior. My vegetables are larger, healthier, and the soil quality has visibly improved.",
    author: "Vinay Kulkanri.",
    location: "Hyderabad , Telengana",
  },
  {
    id: 5,
    rating: 4,
    quote: "Great product for my potted flowers. They're blooming more vibrantly. The only reason for 4 stars is that I wish there were larger pack sizes available.",
    author: "Meenakshi.",
    location: "Hyderabad,Telengana",
  },
  {
    id: 6,
    rating: 5,
    quote: "The indoor plant elixir is a game-changer! My fiddle leaf fig, which was struggling, has new growth and looks fantastic. Easy to use and effective.",
    author: "Rohit.",
    location: "Hyderabad, Telengana",
  },
];

function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section - Reviews */}
        <section className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
            Customer Voices
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-green-950 mt-4 leading-tight">
            What Our Gardeners Are Saying
          </h1>
          <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
            Hear directly from our community of passionate gardeners who have transformed their plants and soil with The Good Soil Co.
          </p>
          <div className="flex items-center gap-2 justify-center mt-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-green-500 text-green-500" />
              ))}
            </div>
            <span className="text-lg text-green-800 font-semibold">4.9/5 Average Rating from 2,000+ Reviews</span>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-green-200 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-green-400 text-green-400" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gray-300" /> // Empty stars
                  ))}
                </div>
                <p className="text-green-800 mb-6 leading-relaxed text-lg flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 mt-auto"> {/* Aligned to bottom */}
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center text-lg shadow-sm">
                    <User className="h-6 w-6 text-green-800" /> {/* Generic User icon */}
                  </div>
                  <div>
                    <div className="font-semibold text-green-950 text-base">{testimonial.author}</div>
                    <div className="text-sm text-green-700">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Call to Action Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-green-950 mb-4">Ready to Grow Your Best Garden Yet?</h2>
          <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
            Explore our products and join the community of gardeners nurturing their plants naturally.
          </p>
          <Link to="/productpage">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Shop Our Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;
