import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Package, Truck, Clock, DollarSign, Globe, ArrowRight,CheckCircle,HelpCircle } from 'lucide-react';

function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto">

        {/* Hero Section - Shipping Information */}
        <section className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
            Delivery Details
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-green-950 mt-4 leading-tight">
            Shipping & Delivery Information
          </h1>
          <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
            Everything you need to know about how your organic fertilizers will reach your doorstep.
          </p>
        </section>

        {/* Key Shipping Details */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4 flex flex-col items-center text-center">
              <Truck className="h-12 w-12 text-green-700 mb-2" />
              <h3 className="font-bold text-xl text-green-950">Domestic Shipping (India)</h3>
              <p className="text-green-800">
                We offer nationwide shipping across India. Standard delivery usually takes **5-7 business days** depending on your location. Express options may be available at checkout.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4 flex flex-col items-center text-center">
              <Globe className="h-12 w-12 text-green-700 mb-2" />
              <h3 className="font-bold text-xl text-green-950">International Shipping</h3>
              <p className="text-green-800">
                Currently, we primarily ship within India. For international inquiries, please <Link to="/contact" className="text-green-600 hover:underline">contact us directly</Link> for custom quotes and feasibility.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4 flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-green-700 mb-2" />
              <h3 className="font-bold text-xl text-green-950">Processing Time</h3>
              <p className="text-green-800">
                Orders are typically processed within **1-2 business days** after payment confirmation. You will receive a tracking number via email once your order ships.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4 flex flex-col items-center text-center">
              <DollarSign className="h-12 w-12 text-green-700 mb-2" />
              <h3 className="font-bold text-xl text-green-950">Shipping Costs</h3>
              <p className="text-green-800">
                Shipping costs are calculated at checkout based on your order's weight, dimensions, and destination. We offer **free shipping on all orders above ₹1500!**
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What to Expect */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-green-950 text-center mb-8">What to Expect</h2>
          <ul className="space-y-6 text-lg text-green-800 leading-relaxed">
            <li className="flex items-start gap-4">
              <Package className="h-7 w-7 text-green-600 flex-shrink-0 mt-1" />
              <span>
                **Secure Packaging:** All our products are carefully packed to ensure they arrive in perfect condition, protecting against transit damage.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle className="h-7 w-7 text-green-600 flex-shrink-0 mt-1" />
              <span>
                **Order Tracking:** Once your order is dispatched, you will receive an email with a tracking number, allowing you to monitor its journey to you.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <HelpCircle className="h-7 w-7 text-green-600 flex-shrink-0 mt-1" />
              <span>
                **Delivery Issues:** In the rare event of a delivery issue (e.g., lost package, significant delay), please <Link to="/contact" className="text-green-600 hover:underline">contact our customer support</Link> immediately for assistance.
              </span>
            </li>
          </ul>
        </section>

        {/* Back to Home CTA */}
        <div className="text-center mt-20">
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Back to Homepage
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShippingInfoPage;
