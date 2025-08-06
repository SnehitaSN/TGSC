// src/pages/OrderDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Calendar, Package, MapPin, CreditCard, ArrowLeft, Loader2, XCircle } from 'lucide-react'; // Added Loader2, XCircle

function OrderDetailPage() {
  const { orderId } = useParams(); // Get orderId from the URL
  const navigate = useNavigate(); // For redirection if not authenticated
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      const authToken = localStorage.getItem('authToken'); // Get your JWT token

      if (!authToken) {
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }

      try {
        // ⭐ Call your backend API to fetch order details
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}` // Send JWT token
          }
        });

        const data = await response.json();

        if (response.ok) {
          setOrder(data);
        } else {
          setError(data.message || 'Failed to fetch order details.');
        }
      } catch (err) {
        console.error('Network error fetching order details:', err);
        setError('Could not connect to the server. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('No order ID provided.');
      setLoading(false);
    }
  }, [orderId, navigate]); // Re-run effect if orderId changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <Loader2 className="h-10 w-10 animate-spin text-green-700" />
        <p className="ml-3 text-lg text-green-800">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <XCircle className="h-10 w-10 text-red-600" />
        <p className="ml-3 text-lg text-red-800">{error}</p>
        <Link to="/accountpage" className="ml-4">
            <Button>Go to Account</Button>
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <p className="text-lg text-gray-800">Order not found.</p>
        <Link to="/accountpage" className="ml-4">
            <Button>Go to Account</Button>
        </Link>
      </div>
    );
  }

  // Format date for display
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-green-950 mb-10 drop-shadow-sm">
          Order Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary Card */}
          <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-950 flex items-center gap-2">
                <Package className="h-6 w-6" /> Order # {order.id}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-green-800">
              <p className="flex justify-between items-center">
                <span className="font-semibold">Order Date:</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-green-700" /> {orderDate}
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-semibold">Total Amount:</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-semibold">Status:</span>
                <Badge
                  variant={
                    order.order_status === 'Delivered'
                      ? 'success'
                      : order.order_status === 'Cancelled'
                      ? 'destructive'
                      : 'default' // Or a specific warning variant
                  }
                  className={`capitalize ${
                    order.order_status === 'Delivered' ? 'bg-green-500 hover:bg-green-600' :
                    order.order_status === 'Cancelled' ? 'bg-red-500 hover:bg-red-600' :
                    'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  {order.order_status}
                </Badge>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-semibold">Payment Status:</span>
                <Badge
                  variant={
                    order.payment_status === 'Paid'
                      ? 'success'
                      : order.payment_status === 'Failed'
                      ? 'destructive'
                      : 'default'
                  }
                  className={`capitalize ${
                    order.payment_status === 'Paid' ? 'bg-green-500 hover:bg-green-600' :
                    order.payment_status === 'Failed' ? 'bg-red-500 hover:bg-red-600' :
                    'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  {order.payment_status}
                </Badge>
              </p>

              <div className="pt-4 border-t border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Order Items:</h3>
                <ul className="space-y-2">
                  {order.items && order.items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.product_name} (x{item.quantity})</span>
                      <span>${(item.product_price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Shipping and Payment Information Card */}
          <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-950 flex items-center gap-2">
                <MapPin className="h-6 w-6" /> Shipping & Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-green-800">
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Shipping Address:</h3>
                <p>{order.shipping_full_name}</p>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                <p>{order.shipping_country}</p>
              </div>

              <div className="pt-4 border-t border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Payment Details:</h3>
                <p className="text-amber-800 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-700" />
                    {order.payment_method}
                    {order.transaction_id && ` (ID: ${order.transaction_id})`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <Link to="/productpage">
            <Button className="bg-gradient-to-r from-green-600 to-amber-800 hover:from-green-700 hover:to-amber-900 text-white">
              Continue Shopping
            </Button>
          </Link>
          <Button variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-50" onClick={() => alert("Tracking functionality coming soon!")}>
            Track Order
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;