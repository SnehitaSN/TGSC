import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { ArrowRight, Sparkles, Leaf, Sprout, Shield } from 'lucide-react'; // Added Leaf, Sprout, Shield icons for the new section

export default function GardenPlannerPage() {
  // State for the custom garden planner form, updated to match index.html fields
  const [plannerFormData, setPlannerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    space: [], // Array for multiple selections
    grow: [], // Array for multiple selections
    experience: '',
    specific_plants: '',
    seeds: '',
    fertilizer: '',
    mixes: '',
    pots: '',
    guidance: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setPlannerFormData(prevState => ({
        ...prevState,
        [name]: checked
          ? [...prevState[name], value]
          : prevState[name].filter(item => item !== value)
      }));
    } else {
      setPlannerFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handlePlannerFormSubmit = async (e) => { // Made the function async
    e.preventDefault();
    console.log("Custom Garden Planner Form Data:", plannerFormData);

    try {
      const response = await fetch('http://localhost:5000/api/garden-plan-submission', { // Adjust URL if your backend is on a different port/domain
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plannerFormData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Show success message from backend
        setPlannerFormData({ // Clear form
          name: '',
          email: '',
          phone: '',
          space: [],
          grow: [],
          experience: '',
          specific_plants: '',
          seeds: '',
          fertilizer: '',
          mixes: '',
          pots: '',
          guidance: ''
        });
      } else {
        alert(`Error: ${data.message || 'Something went wrong.'}`); // Show error message from backend
      }
    } catch (error) {
      console.error("Error submitting garden plan:", error);
      alert("There was an issue submitting your garden plan. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter flex flex-col items-center"> {/* Changed to flex-col */}
      <div className="max-w-3xl mx-auto w-full">

        {/* Hero Section - Garden Planner */}
        <div className="text-center mb-10">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex mb-4">
            Personalized Guidance
          </Badge>
          <h1 className="text-4xl font-extrabold text-green-950 mb-4 flex items-center justify-center">
            <Sparkles className="mr-3 h-8 w-8 text-green-600" /> Let's Grow Your Dream Garden! <Sparkles className="ml-3 h-8 w-8 text-green-600" />
          </h1>
          <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
            Tell us a bit about your space & goals so we can help you grow 🌸
          </p>
        </div>

        {/* New Section: Why Use Our Planner (Arranged like homepage features) */}
      

        {/* Garden Planner Form Section */}
        <Card className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-green-200">
          <form onSubmit={handlePlannerFormSubmit} className="max-w-xl mx-auto space-y-6 text-left">
            {/* Section 1: Your Name & Contact Details */}
            <div className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
              <label htmlFor="name" className="block text-sm font-medium text-green-800 mb-2">1. Your Name & Contact Details</label>
              <Input type="text" name="name" placeholder="Your Name" value={plannerFormData.name} onChange={handleInputChange} className="bg-green-50 border-green-200 text-green-900 placeholder:text-green-600 mb-3" required />
              <Input type="email" name="email" placeholder="Email" value={plannerFormData.email} onChange={handleInputChange} className="bg-green-50 border-green-200 text-green-900 placeholder:text-green-600 mb-3" required />
              <Input type="text" name="phone" placeholder="Phone " required value={plannerFormData.phone} onChange={handleInputChange} className="bg-green-50 border-green-200 text-green-900 placeholder:text-green-600" />
            </div>

            {/* Section 2: What space do you have? */}
            <div className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
              <label className="block text-sm font-medium text-green-800 mb-2">2. What space do you have?</label>
              <div className="option-group flex flex-wrap gap-x-6 gap-y-3">
                {['Balcony', 'Terrace', 'Ground/Backyard', 'Windowsill', 'Indoor Space', 'Vertical Garden'].map(space => (
                  <label key={space} className="flex items-center text-green-800">
                    <input type="checkbox" name="space" value={space} checked={plannerFormData.space.includes(space)} onChange={handleInputChange} className="mr-2 transform scale-110" /> {space}
                  </label>
                ))}
              </div>
            </div>

            {/* Section 3: What would you like to grow? */}
            <div className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
              <label className="block text-sm font-medium text-green-800 mb-2">3. What would you like to grow?</label>
              <div className="option-group flex flex-wrap gap-x-6 gap-y-3">
                {['Vegetables', 'Herbs', 'Fruits', 'Flowers'].map(growType => (
                  <label key={growType} className="flex items-center text-green-800">
                    <input type="checkbox" name="grow" value={growType} checked={plannerFormData.grow.includes(growType)} onChange={handleInputChange} className="mr-2 transform scale-110" /> {growType}
                  </label>
                ))}
              </div>
            </div>

            {/* Section 4: What’s your experience level? */}
            <div className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
              <label className="block text-sm font-medium text-green-800 mb-2">4. What’s your experience level?</label>
              <div className="option-group flex flex-wrap gap-x-6 gap-y-3">
                {['Beginner', 'Intermediate', 'Expert'].map(level => (
                  <label key={level} className="flex items-center text-green-800">
                    <input type="radio" name="experience" value={level} checked={plannerFormData.experience === level} onChange={handleInputChange} className="mr-2 transform scale-110" /> {level}
                  </label>
                ))}
              </div>
            </div>

            {/* Section 5: Any specific plants you want to grow? */}
            <div className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
              <label htmlFor="specific_plants" className="block text-sm font-medium text-green-800 mb-2">5. Any specific plants you want to grow?</label>
              <Input type="text" name="specific_plants" placeholder="e.g., Tomatoes, Mint, Lemongrass" value={plannerFormData.specific_plants} onChange={handleInputChange} className="bg-green-50 border-green-200 text-green-900 placeholder:text-green-600" />
            </div>

            {/* Sections 6-10: Yes/No questions */}
            {['seeds', 'fertilizer', 'mixes', 'pots', 'guidance'].map((item, index) => (
              <div key={item} className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
                <label className="block text-sm font-medium text-green-800 mb-2">{index + 6}. Do you need {item.replace('mixes', 'potting mixes')}?</label>
                <div className="option-group flex flex-wrap gap-x-6 gap-y-3">
                  <label className="flex items-center text-green-800">
                    <input type="radio" name={item} value="yes" checked={plannerFormData[item] === 'yes'} onChange={handleInputChange} className="mr-2 transform scale-110" /> Yes
                  </label>
                  <label className="flex items-center text-green-800">
                    <input type="radio" name={item} value="no" checked={plannerFormData[item] === 'no'} onChange={handleInputChange} className="mr-2 transform scale-110" /> No
                  </label>
                </div>
              </div>
            ))}

            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full"
            >
              Submit & Get My Garden Plan <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
          <div className="mt-8 text-center">
            <Link to="/productpage">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Back to Products
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
