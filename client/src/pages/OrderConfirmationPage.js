import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button'; // Assuming Button is a named export
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'; // Assuming Card components are named exports
import { CheckCircle } from 'lucide-react';

function OrderConfirmationPage() {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Retrieve order details from location state
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
    } else {
      // Handle case where order details are not passed (e.g., direct access)
      console.warn("No order details found. User may have accessed this page directly.");
      // In a real app, you might redirect to home or display a generic message
    }
  }, [location.state]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8 font-inter flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8 border-red-300 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-700 text-2xl font-bold">No Order Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">It looks like you've reached this page without a completed order. Please try placing an order again.</p>
            <Link to="/">
              <Button className="bg-red-500 hover:bg-red-600 text-white">Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-green-200">
        <div className="text-center mb-10">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-extrabold text-green-950 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-amber-800">Thank you for your purchase from The Good Soil Co.!</p>
          <p className="text-md text-amber-700 mt-2">Your order will be processed shortly.</p>
        </div>

        <Card className="border-amber-200 shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-amber-950">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orderDetails.items && orderDetails.items.length > 0 ? (
              orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-green-800">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-amber-800">No items listed for this order.</p>
            )}
            <div className="flex justify-between items-center font-bold text-lg text-green-950 border-t pt-4 mt-4">
              <span>Total Paid:</span>
              <span>₹{orderDetails.total ? orderDetails.total.toFixed(2) : '0.00'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-green-950">Shipping Details</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800 space-y-2">
            <p><strong>Name:</strong> {orderDetails.fullName}</p>
            <p><strong>Address:</strong> {orderDetails.address}, {orderDetails.city}, {orderDetails.state}, {orderDetails.zip}, {orderDetails.country}</p>
            {/* In a real app, you might show a masked card number or payment method type here */}
            <p><strong>Payment Method:</strong> **** **** **** {orderDetails.cardNumber ? orderDetails.cardNumber.slice(-4) : 'N/A'}</p>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Link to="/productpage">
            <Button className="bg-gradient-to-r bg-green-700 hover:bg-green-800 text-white w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/orderhistory"> {/* Assuming an order history page */}
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto">
              View Order History
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
