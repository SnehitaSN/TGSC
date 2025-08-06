import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Leaf, Sprout, FlaskConical, Award, Factory, Users, Target, Eye, Heart,ArrowRight, // Icons for About Us
  CheckCircle, Diamond, Clock, Gem, Scale, Droplets // More specific icons for differentiators
} from 'lucide-react';

// Import the image
import Lab from '../assets/product-images/Lab.png'

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter"> {/* Changed background gradient */}
      <div className="max-w-7xl mx-auto">

        {/* Hero Section - About Us */}
        <section className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex"> {/* Changed badge gradient */}
            Our Story
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-green-950 mt-4 leading-tight">
            Nurturing Plants, Naturally!
          </h1>
          <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
            Discover the passion and science behind The Good Soil Co., dedicated to transforming home gardening with sustainable, organic solutions.
          </p>
        </section>

        {/* Introduction / About The Good Soil Co. */}
        <section className="mb-16">
          <Card className="p-8 border-green-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="space-y-6 text-lg text-green-800 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"> {/* Added grid for side-by-side layout */}
                {/* Left Column: Text Content */}
                <div className="space-y-6">
                  <p>
                    <span className="font-bold text-green-950">The Good Soil Co.</span> is a pioneering startup developing organic, microbial-powered
                    formulas that transform home gardening. Backed by cutting-edge science, our
                    proprietary blends enhance plant resilience and enrich soil vitality, fostering
                    sustainable ecosystems in every garden to Nurture the plants, Naturally!
                  </p>
                  <p className="font-semibold text-green-950">
                    Backed by Microbax (India) Ltd, a leading
                    biotechnology company producing probiotics and other beneficial micro-organisms
                    since 1998.
                  </p>
                  <p className="text-center italic text-green-800 text-xl pt-4">
                    "At The Good Soil Co., we believe that
                    healthy soil is the foundation for healthy plants, healthy people, and a
                    healthier planet."
                  </p>
                </div>

                {/* Right Column: Image */}
                <div className="flex justify-center md:justify-end py-6 md:py-0"> {/* Adjusted image alignment */}
                  <img
                    src={Lab}
                    alt="The Good Soil Co. Product Packaging"
                    className="rounded-lg shadow-md max-w-full h-auto md:max-w-md lg:max-w-lg" // Adjusted max-width for responsiveness
                    loading="lazy"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Key Differentiators Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex"> {/* Changed badge gradient */}
              Our Edge
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-950 mt-4"> {/* Changed text color */}
              What Makes The Good Soil Co. Stand Out
            </h2>
            <p className="max-w-2xl mx-auto text-green-800 md:text-lg leading-relaxed mt-3">
              We go beyond the basics to deliver truly effective and reliable bio-fertilizers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Differentiator 1 */}
            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Diamond className="h-6 w-6 text-green-700" />
                  <h3 className="font-bold text-lg text-green-950">Authentic Microbial Strains</h3>
                </div>
                <p className="text-green-800">
                  <span className="font-semibold">Others:</span> Often absent or unspecified.
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">TGSC:</span> Carefully isolated/selected specific high quality microbial strains.
                </p>
              </CardContent>
            </Card>

            {/* Differentiator 2 */}
            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Sprout className="h-6 w-6 text-green-700" />
                  <h3 className="font-bold text-lg text-green-950">High Spore & Cell Count</h3>
                </div>
                <p className="text-green-800">
                  <span className="font-semibold">Others:</span> Low spore count, viability doubtful.
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">TGSC:</span> Very High Spore Count; High Cell Count of 1.5 billion – 2 billion CFU/g. Guaranteed viability.
                </p>
              </CardContent>
            </Card>

            {/* Differentiator 3 */}
            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-green-700" />
                  <h3 className="font-bold text-lg text-green-950">Longer Shelf Life</h3>
                </div>
                <p className="text-green-800">
                  <span className="font-semibold">Others:</span> Typically 6-12 Months.
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">TGSC:</span> Higher shelf life of about 2 years.
                </p>
              </CardContent>
            </Card>

            {/* Differentiator 4 */}
            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-green-700" />
                  <h3 className="font-bold text-lg text-green-950">Temperature Tolerance</h3>
                </div>
                <p className="text-green-800">
                  <span className="font-semibold">Others:</span> Variable sustainability to temperatures.
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">TGSC:</span> Tolerates temperature variance, ensuring viable spores (Dextrose Base).
                </p>
              </CardContent>
            </Card>

            {/* Differentiator 5 */}
            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Droplets className="h-6 w-6 text-green-700" />
                  <h3 className="font-bold text-lg text-green-950">100% Water Soluble</h3>
                </div>
                <p className="text-green-800">
                  <span className="font-semibold">Others:</span> Often not fully water soluble or leave residue.
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">TGSC:</span> Good carrier-based product; 100% Water Soluble.
                </p>
              </CardContent>
            </Card>

            {/* Differentiator 6 (Written Guarantee) */}
            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-700" />
                  <h3 className="font-bold text-lg text-green-950">Guaranteed Performance</h3>
                </div>
                <p className="text-green-800">
                  <span className="font-semibold">Others:</span> No written guarantee.
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">TGSC:</span> Yes, guaranteed viability and performance.
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-lg text-green-800 leading-relaxed mt-10 max-w-4xl mx-auto">
            TGSC bio fertilizers stand out with live, high-spore-count bacteria,
            ensuring superior viability, longer shelf life, and resistance to temperature
            variations. Unlike others, they offer guaranteed performance, 100% solubility,
            and hassle-free storage.
          </p>
        </section>

        {/* Product Strategy */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex"> {/* Changed badge gradient */}
              Our Approach
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-950 mt-4">
              Our Product Strategy: Building a Sustainable Community
            </h2>
            <p className="max-w-2xl mx-auto text-green-800 md:text-lg leading-relaxed mt-3">
              Our strategy is rooted in sustainability, innovation, and meeting the diverse needs of all growers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm"> {/* Changed border color */}
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-xl text-green-950 flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-green-700" /> Focus on Sustainability
                </h3>
                <ul className="list-disc list-inside text-green-800 space-y-2">
                  <li>Exclusively organic, 0% chemicals.</li>
                  <li>Tried and tested microbial formulations developed over decades of R&D.</li>
                  <li>Eco-friendly farming products.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-xl text-green-950 flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-700" /> Community Focus & Scalability
                </h3>
                <ul className="list-disc list-inside text-green-800 space-y-2">
                  <li>Supports both Farmers and Hobby Gardeners.</li>
                  <li>Capacity built to address demands of large farming community.</li>
                  <li>Solutions for full crop cycles.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-green-200 shadow-md bg-white/70 backdrop-blur-sm"> {/* Changed border color */}
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-xl text-green-950 flex items-center gap-2">
                  <Diamond className="h-6 w-6 text-green-700" /> Scalable Customization
                </h3>
                <p className="text-green-800">
                  Developing the right product mix to meet diverse user requirements. We offer custom solutions for all crop types and all-weather conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mission, Vision, Core Values */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-200 shadow-md bg-green-50/50">
              <CardContent className="p-6 space-y-4 text-center">
                <Target className="h-10 w-10 text-green-700 mx-auto mb-3" />
                <h3 className="font-bold text-xl text-green-950">Our Mission</h3>
                <p className="text-green-800 leading-relaxed">
                  Empower home gardeners with organic products, knowledge, and tools to create
                  thriving, healthy, 100% chemical-free gardens.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-md bg-green-50/50"> {/* Changed border and background */}
              <CardContent className="p-6 space-y-4 text-center">
                <Eye className="h-10 w-10 text-green-700 mx-auto mb-3" /> {/* Changed icon color */}
                <h3 className="font-bold text-xl text-green-950">Our Vision</h3>
                <p className="text-green-800 leading-relaxed">
                  To be the leading provider of organic gardening solutions, inspiring a community of environmentally
                  conscious gardeners and championing sustainable practices for a greener future.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-md bg-green-50/50">
              <CardContent className="p-6 space-y-4 text-center">
                <Heart className="h-10 w-10 text-green-700 mx-auto mb-3" />
                <h3 className="font-bold text-xl text-green-950">Core Values</h3>
                <p className="text-green-800 leading-relaxed">
                  Committed to sustainability, innovation, and integrity to deliver high-quality home gardening
                  solutions that nurture plants Naturally while creating a cleaner, greener, healthier future.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action at the bottom */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-green-950 mb-4">Ready to Grow with Us?</h2>
          <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
            Explore our products and join the community of gardeners nurturing their plants naturally.
          </p>
          <Link to="/productpage"> {/* Corrected link to /products */}
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"> {/* Changed button gradient */}
              Shop Our Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;