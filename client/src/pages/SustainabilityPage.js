import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Leaf, Recycle, Lightbulb, Droplets, Factory, ArrowRight, Sun } from 'lucide-react'; // Changed Water to Droplets

function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto">

        {/* Hero Section - Sustainability */}
        <section className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
            Our Commitment
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-green-950 mt-4 leading-tight">
            Cultivating a Greener Future
          </h1>
          <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
            At The Good Soil Co., sustainability is at the core of everything we do, from our products to our practices.
          </p>
        </section>

        {/* Introduction to Our Philosophy */}
        <section className="mb-16">
          <Card className="p-8 border-green-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="space-y-6 text-lg text-green-800 leading-relaxed">
              <p>
                We believe that true nourishment extends beyond just plants to the planet itself. Our mission is deeply rooted in fostering ecological balance and promoting a healthier environment through responsible gardening. By choosing The Good Soil Co., you're not just growing beautiful plants; you're contributing to a more sustainable world.
              </p>
              <p className="font-semibold text-green-950">
                Our commitment to sustainability guides every decision, from sourcing ingredients to packaging and production.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Pillars of Our Sustainability */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
              Our Actions
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-950 mt-4">
              Our Core Sustainability Pillars
            </h2>
            <p className="max-w-2xl mx-auto text-green-800 md:text-lg leading-relaxed mt-3">
              We focus on key areas to minimize our environmental footprint and maximize positive impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <Leaf className="h-10 w-10 text-green-700 mb-2" />
                <h3 className="font-bold text-xl text-green-950">Organic Ingredients</h3>
                <p className="text-green-800">
                  We use only 100% natural, bio-based ingredients, ensuring no harmful chemicals enter your garden or the ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <Recycle className="h-10 w-10 text-green-700 mb-2" />
                <h3 className="font-bold text-xl text-green-950">Eco-Friendly Packaging</h3>
                <p className="text-green-800">
                  Our packaging is designed to be recyclable, biodegradable, or made from recycled materials, minimizing waste.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <Droplets className="h-10 w-10 text-green-700 mb-2" /> {/* Changed Water to Droplets */}
                <h3 className="font-bold text-xl text-green-950">Resource Efficiency</h3>
                <p className="text-green-800">
                  We implement water-saving and energy-efficient practices in our production processes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <Lightbulb className="h-10 w-10 text-green-700 mb-2" />
                <h3 className="font-bold text-xl text-green-950">Sustainable Sourcing</h3>
                <p className="text-green-800">
                  We prioritize sourcing raw materials from suppliers who adhere to sustainable and ethical practices.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <Factory className="h-10 w-10 text-green-700 mb-2" />
                <h3 className="font-bold text-xl text-green-950">Local Production</h3>
                <p className="text-green-800">
                  Producing locally (backed by Microbax India Ltd) reduces our carbon footprint associated with transportation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <Sun className="h-10 w-10 text-green-700 mb-2" />
                <h3 className="font-bold text-xl text-green-950">Promoting Green Habits</h3>
                <p className="text-green-800">
                  We encourage our community to adopt eco-friendly gardening techniques through our guides and initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action at the bottom */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-green-950 mb-4">Join Us in Growing Greener!</h2>
          <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
            Explore our organic products and be a part of the movement towards a more sustainable and vibrant planet.
          </p>
          <Link to="/productpage">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Shop Sustainable Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SustainabilityPage;