import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'; // Assuming Card components are named exports
import { Button } from '../components/ui/Button'; // Assuming Button is a named export
import { Badge } from '../components/ui/Badge'; // Ensure Badge is correctly imported as a named export
import { Package, Calendar,ArrowRight } from 'lucide-react';

function OrderHistoryPage() {
  // In a real application, you would fetch user's order history from your backend API
  // based on the authenticated user's ID.
  const mockOrderHistory = [
    {
      id: 'ORD001',
      date: '2024-06-20',
      total: 79.97,
      status: 'Delivered',
      items: [
        { name: 'Organic All-Purpose Soil Boost', quantity: 2, price: 24.99 },
        { name: 'Flowering Bloom Enhancer', quantity: 1, price: 29.99 },
      ],
    },
    {
      id: 'ORD002',
      date: '2024-05-15',
      total: 19.99,
      status: 'Shipped',
      items: [{ name: 'Indoor Plant Fortifier', quantity: 1, price: 19.99 }],
    },
    {
      id: 'ORD003',
      date: '2024-04-01',
      total: 55.00,
      status: 'Cancelled',
      items: [
        { name: 'Vegetable Garden Booster', quantity: 2, price: 27.50 },
      ],
    },
  ];

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setOrders(mockOrderHistory);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-amber-950 mt-4 leading-tight">
            Your Order History
          </h1>
          <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
            Review your past purchases and track their status.
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="border-green-200 text-center p-8 bg-white/90 shadow-md">
            <CardContent>
              <p className="text-lg text-amber-800 mb-6">You haven't placed any orders yet.</p>
              <Link to="/products">
                <Button className="bg-gradient-to-r from-green-600 to-amber-800 hover:from-green-700 hover:to-amber-900 text-white">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <Card key={order.id} className="border-amber-200 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-green-950 text-xl flex items-center gap-2">
                    Order ID: {order.id}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-green-800 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{order.date}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="border-b border-green-100 pb-4">
                    <h3 className="font-semibold text-amber-950 mb-2">Items:</h3>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-amber-800 text-sm">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-green-950">
                    <span>Total:</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-md">
                    <span className="text-amber-800">Status:</span>
                    <Badge className={`py-1 px-3 shadow-sm ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="pt-4 border-t border-amber-100">
                    <Link to={`/order-details/${order.id}`}> {/* Link to a hypothetical order detail page */}
                      <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                        View Order Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryPage;
