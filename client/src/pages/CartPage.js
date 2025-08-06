import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Trash2, ShoppingCart, ArrowRight, Loader2, XCircle } from 'lucide-react';

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(null);

  // Function to handle authentication errors (e.g., expired/invalid token)
  const handleAuthError = (errorMessage) => {
    localStorage.removeItem('authToken'); // Clear the expired/invalid token
    setCartError(errorMessage || "Your session has expired. Please log in again.");
    setCartItems([]); // Clear cart data
    setLoadingCart(false); // Stop loading
    navigate('/login', { state: { from: location.pathname } }); // Redirect to login
  };

  // Function to fetch cart items from backend
  const fetchCartItems = async () => {
    setLoadingCart(true);
    setCartError(null);
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      handleAuthError("You must be logged in to view your cart.");
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
        // ⭐ Handle expired/invalid token specifically
        const errorData = await response.json();
        handleAuthError(errorData.message);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch cart items.');
      }

      const data = await response.json();
      const items = (data.items || []).map(item => ({
          id: item.product_id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          image: item.image_url
      }));
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartError(error.message || "Could not load cart. Please try again.");
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  // Initial load of cart items on component mount
  useEffect(() => {
    fetchCartItems();

    window.addEventListener('cartUpdated', fetchCartItems);

    return () => {
      window.removeEventListener('cartUpdated', fetchCartItems);
    };
  }, []);


  // Handle quantity change via backend API
  const handleQuantityChange = async (productId, newQuantity) => {
    let quantity = parseInt(newQuantity, 10);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    if (quantity > 10) quantity = 10;

    setLoadingCart(true);
    setCartError(null);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        handleAuthError("Authentication required to update cart.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/cart/update-item", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ productId, quantity }),
        });

        if (response.status === 401 || response.status === 403) {
            // ⭐ Handle expired/invalid token specifically
            const errorData = await response.json();
            handleAuthError(errorData.message);
            return;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update cart item.');
        }

        await fetchCartItems();
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
        console.error("Error updating cart item:", error);
        setCartError(error.message || "Could not update cart item. Please try again.");
    } finally {
        setLoadingCart(false);
    }
  };

  // Handle item deletion via backend API
  const handleDeleteItem = async (productId) => {
    setLoadingCart(true);
    setCartError(null);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        handleAuthError("Authentication required to remove from cart.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/cart/remove-item/${productId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 401 || response.status === 403) {
            // ⭐ Handle expired/invalid token specifically
            const errorData = await response.json();
            handleAuthError(errorData.message);
            return;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to remove cart item.');
        }

        await fetchCartItems();
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
        console.error("Error removing cart item:", error);
        setCartError(error.message || "Could not remove item from cart. Please try again.");
    } finally {
        setLoadingCart(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loadingCart) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8 font-inter flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-green-700" />
        <p className="ml-3 text-lg text-green-800">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-amber-200">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-950">Your Shopping Cart</h1>
          <p className="text-amber-800 text-lg mt-3">Review your selected products before checkout.</p>
        </div>

        {cartError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm flex items-center gap-2 mb-6">
            <XCircle className="h-5 w-5" /> {cartError}
          </div>
        )}

        {cartItems.length === 0 ? (
          <Card className="text-center p-8 border-green-300 bg-white/90 shadow-md">
            <CardHeader>
              <CardTitle className="text-amber-700 text-2xl font-bold">Your Cart is Empty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link to="/productpage">
                <Button className="bg-gradient-to-r from-green-600 to-amber-800 hover:from-green-700 hover:to-amber-900 text-white">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 border-green-100 shadow-sm bg-white/80">
                <img
                  src={item.image || `https://placehold.co/100x100/cccccc/333333?text=${item.name.replace(/\s/g, '+')}`}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg mr-4 mb-4 sm:mb-0"
                />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-xl font-bold text-green-950 mb-1">{item.name}</h3>
                  <p className="text-amber-800 mb-2">₹{item.price.toFixed(2)}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="border-green-400 text-green-700 hover:bg-green-50"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      min="1"
                      max="10"
                      className="w-16 text-center border-amber-300 focus:border-green-500 focus:ring-green-500 rounded-md"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      className="border-green-400 text-green-700 hover:bg-green-50"
                    >
                      +
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                      className="ml-4 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-lg font-semibold text-green-950 mt-4 sm:mt-0 sm:ml-auto">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </Card>
            ))}

            <Card className="p-6 border-amber-300 shadow-md">
              <div className="flex justify-between items-center text-2xl font-bold text-green-950 mb-6">
                <span>Total Cart Value:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Link to="/productpage">
                  <Button variant="outline" className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Continue Shopping
                  </Button>
                </Link>
                <Link to="/checkout">
                  <Button className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white">
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
