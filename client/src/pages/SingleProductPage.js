import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ShoppingCart, ArrowLeft, Tag, Clock, Package, CheckCircle, Star, Loader2, XCircle } from 'lucide-react'; // Added Loader2, XCircle

export default function SingleProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false); // New state for add to cart loading
  const [cartMessage, setCartMessage] = useState({ show: false, type: '', message: '' }); // New state for cart messages

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/products_s/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(`Failed to fetch product with ID ${id}:`, err);
        setError("Failed to load product details. Please ensure the backend server is running and accessible, and that the product ID exists.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const calculateDiscountedPrice = (price, discountPercentage) => {
    const actualPrice = parseFloat(price) || 0;
    const actualDiscountPercentage = parseFloat(discountPercentage) || 0;

    if (actualDiscountPercentage > 0) {
      return actualPrice * (1 - actualDiscountPercentage / 100);
    }
    return actualPrice;
  };

  // ⭐ UPDATED: handleAddToCart to use backend API
  const handleAddToCart = async (productToAdd) => {
    setAddingToCart(true); // Set loading state
    setCartMessage({ show: false, type: '', message: '' }); // Clear previous messages

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setCartMessage({ show: true, type: 'error', message: 'You must be logged in to add items to cart.' });
      setAddingToCart(false);
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId: productToAdd.id, quantity: 1 }), // Always add 1 from single product page
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
      setCartMessage({ show: true, type: 'success', message: data.message || 'Item added to cart!' });

      // ⭐ Dispatch a custom event to notify Header and CartPage to update their counts/data
      window.dispatchEvent(new Event('cartUpdated'));

    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartMessage({ show: true, type: 'error', message: err.message || 'Error adding item to cart.' });
    } finally {
      setAddingToCart(false); // Reset loading state
      setTimeout(() => setCartMessage({ show: false, type: '', message: '' }), 3000); // Hide message after 3 seconds
    }
  };

  // ⭐ handleBuyNow function for direct purchase
  const handleBuyNow = async (productToBuy) => {
    // A more robust "Buy Now" would typically:
    // 1. Add the item to the cart via API (similar to handleAddToCart)
    // 2. Then navigate to the checkout page.
    // For simplicity, we'll just navigate to checkout with query params for now,
    // but be aware this doesn't persist the item in the backend cart unless you add it.
    console.log(`Initiating direct purchase for product ${productToBuy.id}!`);
    const priceToBuy = calculateDiscountedPrice(productToBuy.price, productToBuy.discount_percentage);
    navigate(`/checkout?productId=${productToBuy.id}&quantity=1&price=${priceToBuy}&originalPrice=${productToBuy.price}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-green-700" />
        <p className="text-xl text-green-800">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
        <XCircle className="mr-2 h-8 w-8 text-red-600" />
        <p className="text-xl text-red-600 text-center mb-4">{error}</p>
        <Link to="/productpage">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
        <p className="text-xl text-green-800 mb-4">Product not found.</p>
        <Link to="/productpage">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount_percentage);
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
  const discountedAmount = product.price * (product.discount_percentage / 100);

  const productRating = parseFloat(product.rating) || 0;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-gradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.729c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" fill="url(#half-gradient)"/>
        </svg>
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={product.image_url || `https://placehold.co/600x400/cccccc/333333?text=${(product.name || 'Product').replace(/\s/g, '+')}`}
              alt={product.name || 'Product Image'}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/cccccc/333333?text=${(product.name || 'Product').replace(/\s/g, '+')}`; }}
            />
          </div>
          <div className="md:w-1/2 flex flex-col justify-center">
            <Badge className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 mb-3 py-1 px-3 shadow-sm inline-flex w-fit">
              {product.category || 'Uncategorized'}
            </Badge>
            <h1 className="text-4xl font-extrabold text-green-950 mb-4 leading-tight">
              {product.name || 'Unnamed Product'}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-4">
              {renderStars(productRating)}
              <span className="ml-2 text-green-700 text-sm">({productRating.toFixed(1)} / 5)</span>
            </div>

            <p className="text-green-800 text-lg mb-6 leading-relaxed">
              {product.description || 'No description available.'}
            </p>

            <div className="flex flex-col mb-6">
              {hasDiscount && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg text-gray-500 line-through">
                    ₹{(parseFloat(product.price) || 0).toFixed(2)}
                  </span>
                  <Badge className="bg-red-100 text-red-700 py-1 px-2 text-sm font-semibold">
                    <Tag className="h-4 w-4 mr-1" /> Save ₹{discountedAmount.toFixed(2)} ({product.discount_percentage || 0}%)
                  </Badge>
                </div>
              )}
              <span className="text-4xl font-bold text-green-800">
                {(product.coming_soon === true) ? "—" : `₹${discountedPrice.toFixed(2)}`}
              </span>
            </div>

            {/* Cart Message Display */}
            {cartMessage.show && (
              <div className={`p-3 rounded-md text-sm flex items-center gap-2 mb-4 ${
                cartMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {cartMessage.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                {cartMessage.message}
              </div>
            )}

            {(product.in_stock === true) && !(product.coming_soon === true) ? (
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart} // Disable button while adding
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" /> Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => handleBuyNow(product)}
                >
                  <CheckCircle className="mr-2 h-5 w-5" /> Buy Now
                </Button>
              </div>
            ) : (
              <Badge className="bg-gray-200 text-gray-700 py-2 px-4 text-lg shadow-sm flex items-center justify-center gap-2 w-fit">
                {(product.coming_soon === true) ? (
                  <>
                    <Clock className="h-5 w-5" /> Coming Soon!
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5" /> Out of Stock
                  </>
                )}
              </Badge>
            )}

            <Link to="/productpage" className="mt-8 block">
              <Button variant="outline" className="border-green-400 text-green-700 hover:bg-green-50">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
