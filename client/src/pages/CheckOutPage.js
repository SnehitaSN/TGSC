import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  Calendar,
  Package,
  MapPin,
  CreditCard,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const [orderSummary, setOrderSummary] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(null);
  const [testModeMessage, setTestModeMessage] = useState(null);

  const [order, setOrder] = useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(true);
  const [orderDetailsError, setOrderDetailsError] = useState(null);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // useEffect to fetch cart items from backend
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoadingCart(true);
      setCartError(null);
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setCartError("You must be logged in to view your cart.");
        setLoadingCart(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch cart items.');
        }

        const data = await response.json();
        const items = (data.items || []).map(item => ({
            productId: item.product_id,
            name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity,
            image: item.image_url
        }));

        setOrderSummary(items);
        setTotalAmount(
          items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        );
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartError(error.message || "Could not load cart. Please try again.");
        setOrderSummary([]);
        setTotalAmount(0);
      } finally {
        setLoadingCart(false);
      }
    };

    if (!orderId) {
      fetchCartItems();
    }
  }, [orderId, navigate, location.pathname]);

  // useEffect for OrderDetailPage specific data (if combined component)
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoadingOrderDetails(true);
      setOrderDetailsError(null);
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setOrder(data);
        } else {
          setOrderDetailsError(data.message || 'Failed to fetch order details.');
        }
      } catch (err) {
        console.error('Network error fetching order details:', err);
        setOrderDetailsError('Could not connect to the server. Please try again.');
      } finally {
        setLoadingOrderDetails(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, navigate]);


  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Function to create Razorpay Order on your backend
  const createRazorpayOrderOnBackend = async (amount) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch("http://localhost:5000/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ amount, currency: 'INR' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create Razorpay order on backend.');
      }
      return response.json();
    } catch (error) {
      console.error("Error creating Razorpay order on backend:", error);
      setPaymentError(error.message || "Failed to initiate payment.");
      throw error;
    }
  };

  // Function to verify Razorpay Payment on your backend
  const verifyRazorpayPaymentOnBackend = async (paymentResponse) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch("http://localhost:5000/api/verify-razorpay-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(paymentResponse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment verification failed on backend.');
      }
      return response.json();
    } catch (error) {
      console.error("Error verifying Razorpay payment on backend:", error);
      setPaymentError(error.message || "Payment verification failed.");
      throw error;
    }
  };

  const displayRazorpay = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);
    setTestModeMessage(null); // Clear previous test mode message

    // ⭐ Check for Razorpay Key ID
    const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      setPaymentError(
        "Razorpay API Key (REACT_APP_RAZORPAY_KEY_ID) is not set. Please configure your .env.local file."
      );
      setIsProcessingPayment(false);
      return; // Stop execution if key is missing
    }
    
    // Display test mode message immediately
    setTestModeMessage("Payment Gateway is in TEST MODE. No real transaction will occur.");
    setTimeout(() => setTestModeMessage(null), 5000); // Hide after 5 seconds

    // Basic frontend validation before initiating payment
    if (
      !shippingInfo.fullName ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zip ||
      !shippingInfo.country
    ) {
      setPaymentError("Please fill in all shipping information.");
      setIsProcessingPayment(false);
      return;
    }

    if (orderSummary.length === 0 || totalAmount === 0) {
      setPaymentError(
        "Your cart is empty. Please add items to place an order."
      );
      setIsProcessingPayment(false);
      return;
    }

    try {
      // 1. Create Order on your backend (which also interacts with Razorpay)
      const orderCreationResponse = await createRazorpayOrderOnBackend(totalAmount);
      const razorpayOrderId = orderCreationResponse.id; // Get Razorpay's order_id

      const options = {
        key: razorpayKeyId, // ⭐ Use the validated key
        amount: orderCreationResponse.amount, // Amount in paisa from backend
        currency: orderCreationResponse.currency,
        name: "The Good Soil Co.",
        description: "Order for Organic Fertilizers",
        image: "https://placehold.co/100x100/38A169/ffffff?text=GS", // Placeholder logo
        order_id: razorpayOrderId,
        handler: async function (response) {
          console.log("Razorpay payment response:", response);
          // 2. Verify Payment on your backend (crucial for security)
          try {
            const verificationResult = await verifyRazorpayPaymentOnBackend(response);
            if (verificationResult.verified) {
                setShowSuccessMessage(true);
                // After successful payment and verification, navigate to order confirmation
                setTimeout(() => {
                    navigate(`/order-details/${verificationResult.orderId}`); // Navigate to the actual order ID
                }, 1500);
            } else {
                setPaymentError("Payment verification failed. Please contact support.");
            }
          } catch (verificationError) {
            console.error("Error during payment verification:", verificationError);
            setPaymentError(verificationError.message || "Payment verification failed.");
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: shippingInfo.fullName,
          email: "customer@example.com", // Replace with actual user email if available
          contact: "9999999999", // Replace with actual user phone if available
        },
        notes: {
          address: shippingInfo.address,
        },
        theme: {
          color: "#38A169", // Green theme
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setPaymentError(response.error.description || "Payment failed. Please try again.");
        setIsProcessingPayment(false);
      });
      rzp1.open();
    } catch (err) {
      console.error("Error in Razorpay initiation:", err);
      // Error already set by createRazorpayOrderOnBackend
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    displayRazorpay(); // Triggers the payment flow
  };

  // --- Render for Order Details Page (if orderId is present in URL) ---
  if (orderId) {
    if (loadingOrderDetails) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 font-inter">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-green-700" />
          <p className="ml-3 text-lg text-green-800">Loading order details...</p>
        </div>
      );
    }

    if (orderDetailsError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
          <XCircle className="mr-2 h-8 w-8 text-red-700" />
          <p className="ml-3 text-lg text-red-800">{orderDetailsError}</p>
          <Button onClick={() => navigate("/my-orders")} className="ml-4 bg-green-700 text-white">Back to Orders</Button>
        </div>
      );
    }

    if (!order) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
            <p className="text-lg text-gray-800">Order not found with this ID.</p>
            <Button onClick={() => navigate("/my-orders")} className="ml-4 bg-green-700 text-white">Back to Orders</Button>
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
                  <span>₹{order.total_amount.toFixed(2)}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-semibold">Status:</span>
                  <Badge
                    variant={
                      order.order_status === 'Delivered'
                        ? 'success'
                        : order.order_status === 'Cancelled'
                        ? 'destructive'
                        : 'default'
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
                        <span>₹{(item.product_price * item.quantity).toFixed(2)}</span>
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
                  <p className="text-green-800 flex items-center gap-2">
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
              <Button className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white">
                Continue Shopping
              </Button>
            </Link>
            <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50" onClick={() => alert("Tracking functionality coming soon!")}>
              Track Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render for Checkout Page (when orderId is NOT present) ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-green-950 mb-10 drop-shadow-sm">
          Checkout
        </h1>

        {cartError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm flex items-center gap-2 mb-6">
            <XCircle className="h-5 w-5" /> {cartError}
          </div>
        )}

        {/* Moved Test Mode Message here for better visibility */}
        {testModeMessage && (
          <div className="p-3 bg-blue-100 text-blue-700 rounded-md text-sm flex items-center gap-2 mb-6">
            <Info className="h-5 w-5" /> {testModeMessage}
          </div>
        )}

        {loadingCart ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-green-700" />
            <p className="text-green-800">Loading your cart...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Information */}
                <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-green-950 flex items-center gap-2">
                      <MapPin className="h-5 w-5" /> Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      label="Address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      placeholder="123 Green Street, Apt 4B"
                      required
                    />
                    <Input
                      label="City"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      placeholder="Flora City"
                      required
                    />
                    <Input
                      label="State"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      placeholder="California"
                      required
                    />
                    <Input
                      label="Zip Code"
                      name="zip"
                      value={shippingInfo.zip}
                      onChange={handleShippingChange}
                      placeholder="90210"
                      required
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      placeholder="USA"
                      required
                    />
                  </CardContent>
                </Card>

                {/* Payment Information - Razorpay handles actual card input */}
                <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-green-950 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" /> Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-green-800">
                      <p className="mb-4">
                        Your payment will be processed securely via Razorpay. Click "Pay Now" to proceed.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm h-fit sticky top-24">
                <CardHeader>
                  <CardTitle className="text-green-950 flex items-center gap-2">
                    <Package className="h-5 w-5" /> Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {orderSummary.length === 0 ? (
                    <div className="text-center text-green-700 py-8">
                      <p>Your cart is empty.</p>
                      <Link to="/productpage" className="text-green-600 hover:underline mt-2 block">
                        Start shopping!
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {orderSummary.map((item) => (
                          <div key={item.productId} className="flex items-center gap-4">
                            <img
                              src={item.image || `https://placehold.co/60x60/cccccc/333333?text=Prod`}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md border border-green-100"
                            />
                            <div className="flex-grow">
                              <p className="font-semibold text-green-900">{item.name}</p>
                              <p className="text-sm text-green-700">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-green-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-green-200 pt-4 mt-4">
                        <div className="flex justify-between font-bold text-lg text-green-950">
                          <span>Total:</span>
                          <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {paymentError && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2 mt-4">
                      <XCircle className="h-5 w-5" /> {paymentError}
                    </div>
                  )}
                  {showSuccessMessage && (
                    <div className="p-3 bg-green-100 text-green-700 rounded-md flex items-center gap-2 mt-4">
                      <CheckCircle className="h-5 w-5" /> Order placed successfully! Redirecting to confirmation...
                    </div>
                  )}

                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-400 text-gray-700 hover:bg-gray-100"
                      onClick={() => navigate("/productpage")}
                    >
                      Back to Products
                    </Button>

                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white"
                      disabled={isProcessingPayment || orderSummary.length === 0}
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Processing...
                        </>
                      ) : (
                        "Pay Now"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;



