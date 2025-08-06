import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  Mail,
  Phone,
  MapPin,
  Send,
  Factory,
  Building,
  CheckCircle,
  X, // Added for error icon
} from "lucide-react";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // Added phone field
    message: "",
  });
  const [submissionSuccess, setSubmissionSuccess] = useState(false); // State for success message
  const [submissionError, setSubmissionError] = useState(false); // State for error message
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => { // Made function async
    e.preventDefault();
    setSubmissionSuccess(false); // Reset messages
    setSubmissionError(false);
    setIsSubmitting(true); // Set submitting to true

    try {
      const response = await fetch('http://localhost:5000/api/contact-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmissionSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" }); // Clear form on success, including phone
        setTimeout(() => setSubmissionSuccess(false), 5000); // Hide message after 5 seconds
      } else {
        setSubmissionError(true);
        // Display specific error message from backend if available
        console.error('Backend error:', data.message || 'Unknown error');
        setTimeout(() => setSubmissionError(false), 5000); // Hide message after 5 seconds
      }
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setSubmissionError(true);
      setTimeout(() => setSubmissionError(false), 5000); // Hide message after 5 seconds
    } finally {
      setIsSubmitting(false); // Reset submitting regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section - Contact Us */}
        <section className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
            Get In Touch
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-green-950 mt-4 leading-tight">
            We'd Love to Hear From You
          </h1>
          <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
            Whether you have a question, feedback, or just want to say hello,
            our team is ready to assist you.
          </p>
        </section>

        {/* Main Content Grid: Contact Form (Left) & Primary Contact Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {" "}
          {/* Added mb-8 for spacing below this grid */}
          {/* Contact Form Card */}
          <Card className="border-green-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-950 flex items-center gap-2">
                <Send className="h-6 w-6" /> Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-green-900 mb-1"
                  >
                    Your Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting} // Disable input during submission
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-green-900 mb-1"
                  >
                    Your Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting} // Disable input during submission
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-green-900 mb-1"
                  >
                    Your Phone Number 
                  </label>
                  <Input
                    type="tel" // Use type="tel" for phone numbers
                    id="phone"
                    name="phone"
                    placeholder="e.g., +91 9876543210"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting} // Disable input during submission
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-green-900 mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                    disabled={isSubmitting} // Disable textarea during submission
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={isSubmitting} // Disable button during submission
                >
                  {isSubmitting ? 'Sending...' : <><Send className="h-4 w-4 mr-2" /> Send Message</>}
                </Button>
                {submissionSuccess && (
                  <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Your message has been sent successfully!</span>
                  </div>
                )}
                {submissionError && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
                    <X className="h-5 w-5" />
                    <span>Failed to send your message. Please try again.</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          {/* Primary Contact Information (Email Us, Call Us, Our Office) */}
          <div className="space-y-6">
            {" "}
            {/* This div stacks the smaller cards vertically */}
            {/* Email Us Card */}
            <Card className="border-green-200 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-950 flex items-center gap-2">
                  <Mail className="h-6 w-6" /> Email Us
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-green-800">
                  For support:{" "}
                  <a
                    href="mailto:support@thegoodsoilco.com"
                    className="text-green-700 hover:underline"
                  >
                    teamtgsc@gmail.com
                  </a>
                </p>
              </CardContent>
            </Card>
            {/* Call Us Card */}
            <Card className="border-green-200 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-950 flex items-center gap-2">
                  <Phone className="h-6 w-6" /> Call Us
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-green-800 ">
                  Customer Service:{" "}
                  <a
                    href="tel:+911234567890"
                    className="text-green-700 hover:underline"
                  >
                    +91 9392286879
                  </a>
                </p>
              </CardContent>
            </Card>
            {/* Our Office Address Card - commented out in original */}
          </div>
        </div>

        {/* New Row for Manufactured By and Marketed By (Horizontal Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {" "}
          {/* Horizontal layout on medium screens and up */}
          {/* Manufactured By Address Card */}
          <Card className="border-green-200 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-950 flex items-center gap-2">
                <Factory className="h-6 w-6" /> Manufacturing Unit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-green-800">
                Microbax (India) Ltd.
                <br />
                406,Sanatana Eternal,
                <br />
                3-6-108/1,Liberty Road,
                <br />
                Himayathnagar,
                <br />
                Hyderabad-500029,
                <br />
                Telengana,INDIA,
                <br />
                Email: info@microbax.com
              </p>
            </CardContent>
          </Card>
          {/* Marketed By Address Card */}
          <Card className="border-green-200 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-950 flex items-center gap-2">
                <Building className="h-6 w-6" /> Sales and Marketing Office
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-green-800">
                The Good Soil Co.
                <br />
                695,BHEL Lingampally,
                <br />
                Hyderabad-502032,
                <br />
                Telengana,INDIA
                <br />
                Email: teamtgsc@gmail.com
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action at the bottom */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-green-950 mb-4">
            Ready to Grow Your Best Garden Yet?
          </h2>
          <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
            Explore our range of organic solutions and join our community of
            sustainable gardeners.
          </p>
          <Link to="/productpage">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Shop Our Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;


