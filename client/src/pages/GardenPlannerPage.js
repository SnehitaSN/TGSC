import React, { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";
import { Link } from "react-router-dom"; // Import Link for navigation
import { ArrowRight, Sparkles, Leaf, Sprout, Shield } from "lucide-react"; // Added Leaf, Sprout, Shield icons for the new section

export default function GardenPlannerPage() {
  // State for the custom garden planner form, updated to match index.html fields
  const [plannerFormData, setPlannerFormData] = useState({
    name: "",
    email: "",
    phone: "",
    space: [], // Array for multiple selections
    grow: [], // Array for multiple selections
    experience: "",
    specific_plants: "",
    seeds: "",
    fertilizer: "",
    mixes: "",
    pots: "",
    guidance: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  // ⭐ ADDED: Define the dynamic backend URL
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setPlannerFormData((prevState) => ({
        ...prevState,
        [name]: checked
          ? [...prevState[name], value]
          : prevState[name].filter((item) => item !== value),
      }));
    } else {
      setPlannerFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handlePlannerFormSubmit = async (e) => {
    // Made the function async
    e.preventDefault();
    console.log("Custom Garden Planner Form Data:", plannerFormData);

    try {
      // ⭐ UPDATED: Use the dynamic backend URL to send form data
      const response = await fetch(`${backendUrl}/api/garden-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plannerFormData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Show success message from backend
        setPlannerFormData({
          // Clear form
          name: "",
          email: "",
          phone: "",
          space: [],
          grow: [],
          experience: "",
          specific_plants: "",
          seeds: "",
          fertilizer: "",
          mixes: "",
          pots: "",
          guidance: "",
        });
      } else {
        alert(`Error: ${data.message || "Something went wrong."}`); // Show error message from backend
      }
    } catch (error) {
      console.error("Error submitting garden plan:", error);
      alert(
        "There was an issue submitting your garden plan. Please try again later."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter flex flex-col items-center">
      {" "}
      {/* Changed to flex-col */}
      <div className="max-w-3xl mx-auto w-full">
        {/* Hero Section - Garden Planner */}
        <div className="text-center mb-10">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex mb-4">
            Personalized Guidance
          </Badge>
          <h1 className="text-4xl font-extrabold text-green-950 mb-4 flex items-center justify-center">
            <Sparkles className="mr-3 h-8 w-8 text-green-600" /> Let's Grow Your
            Dream Garden! <Sparkles className="ml-3 h-8 w-8 text-green-600" />
          </h1>
          <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
            Tell us a bit about your space & goals so we can help you grow 🌸
          </p>
        </div>

        {/* New Section: Why Use Our Planner (Arranged like homepage features) */}

        {/* Garden Planner Form Section */}
        <Card className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-green-200">
          <form
            onSubmit={handlePlannerFormSubmit}
            className="max-w-xl mx-auto space-y-6 text-left"
          >
            {/* Section 1: Your Name & Contact Details */}
            <div className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-green-800 mb-2"
              >
                1. Your Name & Contact Details
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={plannerFormData.name}
                onChange={handleInputChange}
                className="bg-green-50 border-green-200 text-green-900 placeholder:text-green-600 mb-3"
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={plannerFormData.email}
                onChange={handleInputChange}
                className="bg-green-50 border-green-200 text-green-900 placeholder:text-green-600 mb-3"
                required
              />
              <Input
                type="text"
                name="phone"
                placeholder="Phone "
                required
                value={plannerFormData.phone}
                onChange={handleInputChange}
                className="bg-green-50 border-green-200 text-green-900 placeholder:text-green-600"
              />
            </div>

            {/* Section 2: What space do you have? */}
            <div className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
              <label className="block text-sm font-medium text-green-800 mb-2">
                2. What space do you have?
              </label>
              <div className="option-group flex flex-wrap gap-x-6 gap-y-3">
                {[
                  "Balcony",
                  "Terrace",
                  "Ground/Backyard",
                  "Windowsill",
                  "Indoor Space",
                  "Vertical Garden",
                ].map((space) => (
                  <label
                    key={space}
                    className="flex items-center text-green-800"
                  >
                    <input
                      type="checkbox"
                      name="space"
                      value={space}
                      checked={plannerFormData.space.includes(space)}
                      onChange={handleInputChange}
                      className="mr-2 transform scale-110"
                    />{" "}
                    {space}
                  </label>
                ))}
              </div>
            </div>

            {/* Section 3: What would you like to grow? */}
            <div className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
              <label className="block text-sm font-medium text-green-800 mb-2">
                3. What would you like to grow?
              </label>
              <div className="option-group flex flex-wrap gap-x-6 gap-y-3">
                {["Vegetables", "Herbs", "Fruits", "Flowers"].map(
                  (growType) => (
                    <label
                      key={growType}
                      className="flex items-center text-green-800"
                    >
                      <input
                        type="checkbox"
                        name="grow"
                        value={growType}
                        checked={plannerFormData.grow.includes(growType)}
                        onChange={handleInputChange}
                        className="mr-2 transform scale-110"
                      />{" "}
                      {growType}
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Section 4: What’s your experience level? */}
            <div className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
              <label className="block text-sm font-medium text-green-800 mb-2">
                4. What’s your experience level?
              </label>
              <div className="option-group flex flex-wrap gap-x-6 gap-y-3">
                {["Beginner", "Intermediate", "Expert"].map((level) => (
                  <label
                    key={level}
                    className="flex items-center text-green-800"
                  >
                    <input
                      type="radio"
                      name="experience"
                      value={level}
                      checked={plannerFormData.experience === level}
                      onChange={handleInputChange}
                      className="mr-2 transform scale-110"
                    />{" "}
                    {level}
                  </label>
                ))}
              </div>
            </div>

            {/* Section 5: Any specific plants you want to grow? */}
            <div className="section bg-white p-6 rounded-lg shadow-inner border border-green-100">
              <label
                htmlFor="specific_plants"
                className="block text-sm font-medium text-green-800 mb-2"
              >
                5. Any specific plants you want to grow?
              </label>
              <Input
                type="text"
                name="specific_plants"
                placeholder="e.g., Tomatoes, Mint, Lemongrass"
                value={plannerFormData.specific_plants}
                onChange={handleInputChange}
                className="bg-green-50 border-green-200 text-green-900 placeholder:text-green-600"
              />
            </div>

            {/* Sections 6-10: Yes/No questions */}
            {["seeds", "fertilizer", "mixes", "pots", "guidance"].map(
              (item, index) => (
                <div
                  key={item}
                  className="section bg-white p-6 rounded-lg shadow-inner border border-green-100"
                >
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    {index + 6}. Do you need{" "}
                    {item.replace("mixes", "potting mixes")}?
                  </label>
                  <div className="option-group flex flex-wrap gap-x-6 gap-y-3">
                    <label className="flex items-center text-green-800">
                      <input
                        type="radio"
                        name={item}
                        value="yes"
                        checked={plannerFormData[item] === "yes"}
                        onChange={handleInputChange}
                        className="mr-2 transform scale-110"
                      />{" "}
                      Yes
                    </label>
                    <label className="flex items-center text-green-800">
                      <input
                        type="radio"
                        name={item}
                        value="no"
                        checked={plannerFormData[item] === "no"}
                        onChange={handleInputChange}
                        className="mr-2 transform scale-110"
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              )
            )}

            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full"
            >
              Submit & Get My Garden Plan{" "}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
          <div className="mt-8 text-center">
            <Link to="/productpage">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Back to Products
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}


// import React, { useState } from 'react';
// import { Input } from '../components/ui/Input';
// import { Button } from '../components/ui/Button';
// import { Badge } from '../components/ui/Badge';
// import { Card, CardContent } from '../components/ui/Card';
// import { Link } from 'react-router-dom';
// import { ArrowRight, Sparkles, Leaf, Sprout, Shield, Loader2, CheckCircle, XCircle } from 'lucide-react';

// export default function GardenPlannerPage() {
//   // State for the custom garden planner form, updated to match index.html fields
//   const [plannerFormData, setPlannerFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     space: [], // Array for multiple selections
//     grow: [], // Array for multiple selections
//     experience: '',
//     specific_plants: '',
//     seeds: 'no',
//     fertilizer: 'no',
//     mixes: 'no',
//     pots: 'no',
//     guidance: 'no'
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submissionMessage, setSubmissionMessage] = useState(null);
//   const [submissionError, setSubmissionError] = useState(null);

//   // ⭐ ADDED: Define the dynamic backend URL
//   const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === 'checkbox') {
//       setPlannerFormData(prevState => ({
//         ...prevState,
//         [name]: checked
//           ? [...prevState[name], value]
//           : prevState[name].filter(item => item !== value)
//       }));
//     } else {
//       setPlannerFormData(prevState => ({
//         ...prevState,
//         [name]: value
//       }));
//     }
//   };

//   const handlePlannerFormSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmissionMessage(null);
//     setSubmissionError(null);

//     // Basic form validation
//     if (!plannerFormData.name || !plannerFormData.email || !plannerFormData.phone) {
//         setSubmissionError("Please fill out all required fields.");
//         setIsSubmitting(false);
//         return;
//     }

//     try {
//       // ⭐ UPDATED: Use the dynamic backend URL to send form data
//       const response = await fetch(`${backendUrl}/api/garden-plan`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(plannerFormData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit the garden plan. Please try again.');
//       }

//       const data = await response.json();
//       console.log("Custom Garden Planner Form Data submitted:", data);
//       setSubmissionMessage("Thank you for your submission! We'll reach out with your personalized garden plan soon.");

//       // Clear form
//       setPlannerFormData({
//         name: '',
//         email: '',
//         phone: '',
//         space: [],
//         grow: [],
//         experience: '',
//         specific_plants: '',
//         seeds: 'no',
//         fertilizer: 'no',
//         mixes: 'no',
//         pots: 'no',
//         guidance: 'no'
//       });
//     } catch (error) {
//       console.error("Error submitting garden plan:", error);
//       setSubmissionError(error.message || 'An unexpected error occurred. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getLabelText = (original, seeds, fertilizer, mixes) => {
//     if (original === 'seeds') return `Are you looking for ${seeds}?`;
//     if (original === 'fertilizer') return `Are you looking for ${fertilizer}?`;
//     if (original === 'mixes') return `Are you looking for ${mixes}?`;
//     return '';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter flex flex-col items-center">
//       <div className="max-w-3xl mx-auto w-full">

//         {/* Hero Section - Garden Planner */}
//         <div className="text-center mb-10">
//           <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex mb-4">
//             Personalized Guidance
//           </Badge>
//           <h1 className="text-4xl font-extrabold text-green-950 mb-4 flex items-center justify-center">
//             <Sparkles className="mr-3 h-8 w-8 text-green-600" /> Let's Grow Your Dream Garden! <Sparkles className="ml-3 h-8 w-8 text-green-600" />
//           </h1>
//           <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
//             Tell us a bit about your space & goals so we can help you grow 🌸
//           </p>
//         </div>

//         {/* New Section: Why Use Our Planner (Arranged like homepage features) */}
//         <section className="w-full py-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-green-200 mb-12">
//           <div className="container px-4 md:px-6 mx-auto max-w-5xl">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
//               <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm">
//                 Why Our Planner?
//               </Badge>
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-950">
//                 Tailored Plans for Every Gardener
//               </h2>
//               <p className="max-w-[800px] text-green-800 md:text-lg">
//                 Our personalized garden planner simplifies your journey, ensuring you get the right advice and products for your unique growing environment.
//               </p>
//             </div>
//             <div className="mx-auto grid max-w-5xl items-start gap-8 py-4 lg:grid-cols-3 lg:gap-12">
//               <Card className="border-green-200 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-green-50/50">
//                 <CardContent className="flex flex-col items-center space-y-5 p-8">
//                   <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md">
//                     <Leaf className="h-7 w-7 text-green-700" />
//                   </div>
//                   <h3 className="text-xl font-bold text-green-950">Customized Recommendations</h3>
//                   <p className="text-center text-green-800 leading-relaxed">
//                     Receive product suggestions and growing tips tailored to your specific space, preferences, and experience level.
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card className="border-green-200 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-green-50/50">
//                 <CardContent className="flex flex-col items-center space-y-5 p-8">
//                   <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md">
//                     <Sprout className="h-7 w-7 text-green-700" />
//                   </div>
//                   <h3 className="text-xl font-bold text-green-950">Expert Guidance</h3>
//                   <p className="text-center text-green-800 leading-relaxed">
//                     Get access to a wealth of knowledge, from soil preparation to pest control, all in one place.
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card className="border-green-200 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-green-50/50">
//                 <CardContent className="flex flex-col items-center space-y-5 p-8">
//                   <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md">
//                     <Shield className="h-7 w-7 text-green-700" />
//                   </div>
//                   <h3 className="text-xl font-bold text-green-950">Start with Confidence</h3>
//                   <p className="text-center text-green-800 leading-relaxed">
//                     Whether you're a beginner or an expert, our planner gives you the confidence to start your gardening journey right.
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>

//         {/* Garden Planner Form */}
//         <form onSubmit={handlePlannerFormSubmit} className="space-y-6 w-full bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-green-200 p-8 sm:p-10">
//           <div className="space-y-4">
//             <h3 className="text-2xl font-bold text-green-950">Personal Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 name="name"
//                 placeholder="Your Name"
//                 value={plannerFormData.name}
//                 onChange={handleInputChange}
//                 required
//               />
//               <Input
//                 name="email"
//                 type="email"
//                 placeholder="Your Email"
//                 value={plannerFormData.email}
//                 onChange={handleInputChange}
//                 required
//               />
//               <Input
//                 name="phone"
//                 type="tel"
//                 placeholder="Your Phone Number"
//                 value={plannerFormData.phone}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-4">
//             <h3 className="text-2xl font-bold text-green-950">Your Space & Goals</h3>
//             <div>
//               <label className="block text-lg font-medium text-green-900 mb-2">What kind of space are you gardening in?</label>
//               <div className="flex flex-wrap gap-x-6 gap-y-3">
//                 {['balcony', 'rooftop', 'backyard', 'indoor'].map((spaceOption) => (
//                   <label key={spaceOption} className="flex items-center text-green-800">
//                     <input
//                       type="checkbox"
//                       name="space"
//                       value={spaceOption}
//                       checked={plannerFormData.space.includes(spaceOption)}
//                       onChange={handleInputChange}
//                       className="mr-2 transform scale-110"
//                     /> {spaceOption.charAt(0).toUpperCase() + spaceOption.slice(1)}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-green-900 mb-2">What do you want to grow?</label>
//               <div className="flex flex-wrap gap-x-6 gap-y-3">
//                 {['vegetables', 'fruits', 'herbs', 'flowers', 'ornamental'].map((growOption) => (
//                   <label key={growOption} className="flex items-center text-green-800">
//                     <input
//                       type="checkbox"
//                       name="grow"
//                       value={growOption}
//                       checked={plannerFormData.grow.includes(growOption)}
//                       onChange={handleInputChange}
//                       className="mr-2 transform scale-110"
//                     /> {growOption.charAt(0).toUpperCase() + growOption.slice(1)}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-green-900 mb-2">What's your gardening experience?</label>
//               <div className="option-group flex flex-wrap gap-x-6 gap-y-3">
//                 {['beginner', 'intermediate', 'experienced'].map((experienceOption) => (
//                   <label key={experienceOption} className="flex items-center text-green-800">
//                     <input
//                       type="radio"
//                       name="experience"
//                       value={experienceOption}
//                       checked={plannerFormData.experience === experienceOption}
//                       onChange={handleInputChange}
//                       className="mr-2 transform scale-110"
//                     /> {experienceOption.charAt(0).toUpperCase() + experienceOption.slice(1)}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <Input
//               name="specific_plants"
//               placeholder="Any specific plants in mind? (e.g., tomatoes, mint, roses)"
//               value={plannerFormData.specific_plants}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="space-y-4">
//             <h3 className="text-2xl font-bold text-green-950">Products of Interest</h3>
//             <p className="text-sm text-green-800">Help us tailor your plan by telling us what products you need.</p>
//             {['seeds', 'fertilizer', 'mixes', 'pots', 'guidance'].map((item) => (
//               <div key={item} className="flex flex-col space-y-2">
//                 <label className="text-lg font-medium text-green-900">{getLabelText(item, 'seeds', 'organic fertilizer', 'potting mixes')}</label>
//                 <div className="option-group flex flex-wrap gap-x-6 gap-y-3">
//                   <label className="flex items-center text-green-800">
//                     <input type="radio" name={item} value="yes" checked={plannerFormData[item] === 'yes'} onChange={handleInputChange} className="mr-2 transform scale-110" /> Yes
//                   </label>
//                   <label className="flex items-center text-green-800">
//                     <input type="radio" name={item} value="no" checked={plannerFormData[item] === 'no'} onChange={handleInputChange} className="mr-2 transform scale-110" /> No
//                   </label>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {isSubmitting && (
//             <div className="flex items-center justify-center p-3 text-blue-700 rounded-md">
//               <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
//             </div>
//           )}

//           {submissionError && (
//             <div className="p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
//               <XCircle className="h-5 w-5" /> {submissionError}
//             </div>
//           )}

//           {submissionMessage && (
//             <div className="p-3 bg-green-100 text-green-700 rounded-md flex items-center gap-2">
//               <CheckCircle className="h-5 w-5" /> {submissionMessage}
//             </div>
//           )}

//           <Button
//             type="submit"
//             size="lg"
//             className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <span>Submitting...</span>
//             ) : (
//               <>
//                 Submit & Get My Garden Plan <ArrowRight className="ml-2 h-5 w-5" />
//               </>
//             )}
//           </Button>
//         </form>

//         <div className="mt-8 text-center">
//           <Link to="/productpage">
//             <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
//               Back to Our Products
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
