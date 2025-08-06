import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge'; // Make sure Badge is imported
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

// Mock FAQ Data
const faqItems = [
  {
    question: "What makes The Good Soil Co. fertilizers organic?",
    answer: "Our fertilizers are 100% organic, derived from natural sources and free from synthetic chemicals. We focus on natural microbial processes to enrich your soil.",
  },
  {
    question: "Are your products safe for pets and children?",
    answer: "Yes, our products are formulated with natural ingredients and are completely safe for use around children and pets when used as directed.",
  },
  {
    question: "How often should I use your fertilizers?",
    answer: "Application frequency varies by product and plant type. Please refer to the specific product's instructions for detailed guidance. Generally, our formulas are designed for sustained release.",
  },
  {
    question: "Can I use these products for indoor plants?",
    answer: "Absolutely! Many of our products, especially the Indoor Plant Elixir, are specifically designed to provide optimal nutrition for houseplants.",
  },
  {
    question: "What is the shelf life of your products?",
    answer: "Thanks to our high spore count and dextrose base, our products have a longer shelf life of approximately 2 years when stored correctly in a cool, dry place.",
  },
  {
    question: "Do your products help with pest control?",
    answer: "While our primary focus is on plant nutrition and soil health, healthier plants are naturally more resistant to pests. Some microbial components can also indirectly deter certain soil-borne pests.",
  },
];

function FAQPage() {
  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto">

        {/* Hero Section - FAQ */}
        <section className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
            Common Questions
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-green-950 mt-4 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
            Find answers to the most common questions about our organic fertilizers, gardening practices, and more.
          </p>
        </section>

        {/* FAQ List */}
        <section className="space-y-6 mb-16">
          {faqItems.map((item, index) => (
            <Card key={index} className="border-green-200 shadow-md bg-white/70 backdrop-blur-sm">
              <CardHeader className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <CardTitle className="text-xl font-semibold text-green-950 flex items-center gap-3">
                    <HelpCircle className="h-6 w-6 text-green-700" />
                    {item.question}
                  </CardTitle>
                  <ChevronDown
                    className={`h-6 w-6 text-green-600 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </CardHeader>
              {openIndex === index && (
                <CardContent className="px-6 pb-6 pt-0 text-green-800 leading-relaxed border-t border-green-100 bg-green-50/20">
                  <p>{item.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </section>

        {/* Contact CTA */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-green-950 mb-4">Still Have Questions?</h2>
          <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
            If you couldn't find the answer you're looking for, feel free to reach out to our support team.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Contact Our Support Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;
