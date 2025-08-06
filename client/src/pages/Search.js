import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Search, Package, ArrowRight, XCircle } from 'lucide-react'; // Added XCircle for no results

// Mock product data for search results (can be expanded or fetched from API)
const mockSearchableProducts = [
  {
    id: 1,
    name: "Organic Gardening Kit",
    price: 1150,
    description: "A foundational blend of beneficial microbes and nutrients for vibrant growth in all plants.",
    image: "https://placehold.co/400x300/a3e635/166534?text=Organic+Kit",
    category: "All-Purpose",
  },
  {
    id: 2,
    name: "Compost-R",
    price: 500,
    description: "Formulated to promote prolific and colorful blooms for all flowering plants.",
    image: "https://placehold.co/400x300/84cc16/3f6212?text=CompostR",
    category: "Composting",
  },
  {
    id: 3,
    name: "NPK Fertilizer",
    price: 800,
    description: "Gentle yet effective nutrients to keep your houseplants lush and healthy year-round.",
    image: "https://placehold.co/400x300/fcd34d/78350f?text=NPK+Fertilizer",
    category: "Fertilizer",
  },
  {
    id: 4,
    name: "Growell All-Purpose",
    price: 700,
    description: "Specialized formula for high yields and enhanced flavor in fruits and vegetables.",
    image: "https://placehold.co/400x300/065f46/dcfce7?text=Growell",
    category: "Vegetable and Fruits",
  },
  {
    id: 5,
    name: "Rose Care Kit",
    price: 500,
    description: "Encourages strong root development and protects against common root diseases for roses.",
    image: "https://placehold.co/400x300/92400e/fde68a?text=Rose+Care",
    category: "Flowering",
  },
];

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Perform search when searchTerm changes (after a slight delay for performance)
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setSearchResults([]); // Clear results if search term is empty
        return;
      }
      
      const filteredResults = mockSearchableProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
            Search Our Products & Content
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-green-950 mt-4 leading-tight">
            Find What You're Looking For
          </h1>
          <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
            Enter keywords to explore our wide range of organic fertilizers, blog articles, and more.
          </p>
        </div>

        {/* Search Input Section */}
        <div className="mb-12 max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Search for products, categories, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-lg p-3 rounded-lg border border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 shadow-sm"
            icon={<Search className="h-5 w-5 text-green-600" />}
          />
        </div>

        {/* Search Results Section */}
        <section>
          {searchTerm.trim() === '' ? (
            <div className="text-center text-green-700 text-lg">
              Start typing to see search results.
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((product) => (
                <Card key={product.id} className="group flex flex-col border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/70 backdrop-blur-sm overflow-hidden">
                  <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
                    <img
                      src={product.image || `https://placehold.co/400x300/cccccc/333333?text=${product.name.replace(/\s/g, '+')}`}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-56 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/cccccc/333333?text=${product.name.replace(/\s/g, '+')}`; }}
                    />
                  </Link>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <Badge className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 mb-2 py-1 px-3 shadow-sm inline-flex w-fit">
                      {product.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-green-950 mb-2 line-clamp-2 leading-tight">
                      <Link to={`/products/${product.id}`} className="hover:text-green-700 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-green-800 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">{product.description}</p>
                    
                    <div className="text-2xl font-bold text-green-800 mb-4 mt-auto">
                      ₹{product.price.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white/90 rounded-lg shadow-md border border-gray-200">
              <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <p className="text-lg text-gray-700">No results found for "{searchTerm}".</p>
              <p className="text-md text-gray-500 mt-2">Please try a different search term or browse our products.</p>
              <Link to="/products" className="mt-6 inline-block">
                <Button className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white">
                  Browse All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Call to Action at the bottom */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-green-950 mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
            Our team is here to help you discover the perfect solutions for your garden.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
