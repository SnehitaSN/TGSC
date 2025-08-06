// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button } from '../components/ui/Button';
// import { Card, CardContent } from '../components/ui/Card';
// import { Badge } from '../components/ui/Badge';
// import { ShoppingCart, Package, Heart, CheckCircle, ArrowRight, Clock, Sparkles, Tag } from 'lucide-react'; // Added Tag icon for discount

// // --- IMPORT YOUR LOCAL IMAGES HERE ---
// // Ensure these paths are correct relative to this file
// import CompostR from'../assets/product-images/CompostR.JPG';
// import OrganicGarden from '../assets/product-images/OrganicGarden.JPG';
// import NPK from'../assets/product-images/NPK.jpg';

// // Mock Product Data
// const mockProducts = [
//   {
//     id: 1,
//     name: "Organic Gardening Kit",
//     price: 1150,
//     description: "A foundational blend of beneficial microbes and nutrients for vibrant growth in all plants.",
//     image: OrganicGarden,
//     category: "All-Purpose",
//     inStock: true,
//     discountPercentage: 10, // Added 10% discount
//   },
//   {
//     id: 2,
//     name: "Compost-R",
//     price: 500,
//     description: "Formulated to promote prolific and colorful blooms for all flowering plants.",
//     image: CompostR,
//     category:"Composting",
//     inStock: true,
//     discountPercentage: 0, // No discount
//   },
//   {
//     id: 3,
//     name: "Essential NKP Combo",
//     price: 800,
//     description: "Gentle yet effective nutrients to keep your houseplants lush and healthy year-round.",
//     image: NPK,
//     category: "Fertilizer",
//     inStock: true,
//     discountPercentage: 15, // Added 15% discount
//   },
//   {
//     id: 4,
//     name: "Growell",
//     price: 700,
//     description: "Specialized formula for high yields and enhanced flavor in fruits and vegetables.",
//     image: "https://placehold.co/400x300/84cc16/3f6212?text=Veg+Booster", // Placeholder for now
//     category: "Vegetable and Fruits",
//     inStock: true,
//     discountPercentage: 0,
//   },
//   {
//     id: 5,
//     name: "Rose Kit",
//     price: 500,
//     description: "Encourages strong root development and protects against common root diseases.",
//     image: "https://placehold.co/400x300/92400e/fde68a?text=Root+Care", // Placeholder for now
//     category: "Flowering",
//     inStock: true,
//     discountPercentage: 20, // Added 20% discount
//   },
//   // New Combo Pack Products
//   {
//     id: 6,
//     name: "Germinator+ Combo Pack",
//     price: 1200,
//     description: "Includes Germinator+ fertilizer, premium seeds, and nutrient-rich cocopeat for optimal germination and early growth.",
//     image: "https://placehold.co/400x300/60a5fa/ffffff?text=Germinator+Combo", // Placeholder for new product
//     category: "Combo Pack",
//     inStock: false, // Mark as out of stock/coming soon
//     comingSoon: true, // New property to indicate coming soon
//     discountPercentage: 0,
//   },
//   {
//     id: 7,
//     name: "Vegetable Booster Combo Pack",
//     price: 1500,
//     description: "A comprehensive pack featuring Vegetable Booster fertilizer, high-yield vegetable seeds, and cocopeat for lush, productive vegetable gardens.",
//     image: "https://placehold.co/400x300/22c55e/ffffff?text=Veg+Combo", // Placeholder for new product
//     category: "Combo Pack",
//     inStock: false,
//     comingSoon: true,
//     discountPercentage: 0,
//   },
//   {
//     id: 8,
//     name: "Fruit Booster Combo Pack",
//     price: 1800,
//     description: "Boost your fruit production with this combo pack including Fruit Booster fertilizer, select fruit seeds, and cocopeat for healthier, sweeter fruits.",
//     image: "https://placehold.co/400x300/ef4444/ffffff?text=Fruit+Combo", // Placeholder for new product
//     category: "Combo Pack",
//     inStock: false,
//     comingSoon: true,
//     discountPercentage: 0,
//   },
// ];

// export default function ProductsPage() {
//   const [products, setProducts] = useState(mockProducts);
//   const navigate = useNavigate();

//   const calculateDiscountedPrice = (price, discountPercentage) => {
//     if (discountPercentage && discountPercentage > 0) {
//       return price * (1 - discountPercentage / 100);
//     }
//     return price;
//   };

//   const handleAddToCart = (productId) => {
//     const productToAdd = products.find(p => p.id === productId);
//     if (productToAdd) {
//       const discountedPrice = calculateDiscountedPrice(productToAdd.price, productToAdd.discountPercentage);

//       // Get current cart items from local storage
//       const savedCart = localStorage.getItem('cart');
//       let currentCartItems = savedCart ? JSON.parse(savedCart) : [];

//       const existingItemIndex = currentCartItems.findIndex(item => item.id === productToAdd.id);

//       if (existingItemIndex > -1) {
//         // If item exists, update quantity (up to max 10)
//         currentCartItems[existingItemIndex].quantity = Math.min(currentCartItems[existingItemIndex].quantity + 1, 10);
//         // Ensure the price for existing items is updated to the current discounted price
//         // This is important if discounts change after an item is initially added.
//         currentCartItems[existingItemIndex].price = discountedPrice;
//         currentCartItems[existingItemIndex].originalPrice = productToAdd.price; // Keep original price for display
//         currentCartItems[existingItemIndex].discountPercentage = productToAdd.discountPercentage; // Keep discount percentage
//       } else {
//         // If item doesn't exist, add it with discounted price and original price
//         currentCartItems.push({
//           ...productToAdd,
//           quantity: 1,
//           price: discountedPrice, // Store the discounted price as the item's 'price'
//           originalPrice: productToAdd.price, // Store the original price for display
//           discountPercentage: productToAdd.discountPercentage, // Store discount percentage
//         });
//       }

//       // Save updated cart items back to local storage
//       localStorage.setItem('cart', JSON.stringify(currentCartItems));

//       console.log(`Product ${productToAdd.name} added to cart!`);
//       // Dispatch a custom event to notify other parts of the application about the cart update
//       window.dispatchEvent(new Event('cartUpdated'));
//     }
//   };

//   const handleBuyNow = (product) => {
//     console.log(`Initiating direct purchase for product ${product.id}!`);
//     const priceToBuy = calculateDiscountedPrice(product.price, product.discountPercentage);
//     // Pass product details for direct purchase
//     navigate(`/checkout?productId=${product.id}&quantity=1&price=${priceToBuy}&originalPrice=${product.price}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
//             Our Premium Collection
//           </Badge>
//           <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-green-950 mt-4 leading-tight">
//             Nourish Your Garden, Nurture Your Home
//           </h1>
//           <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
//             Discover our carefully crafted organic fertilizers, designed to bring life and vitality to every plant, from flourishing vegetables to serene indoor greens.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {products.map((product) => {
//             const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
//             const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
//             const discountedAmount = product.price * (product.discountPercentage / 100);

//             return (
//               <Card key={product.id} className="group flex flex-col border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/70 backdrop-blur-sm overflow-hidden">
//                 <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
//                   <img
//                     src={product.image || `https://placehold.co/400x300/cccccc/333333?text=${product.name.replace(/\s/g, '+')}`}
//                     alt={product.name}
//                     width={400}
//                     height={300}
//                     className="w-full h-56 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
//                     onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/cccccc/333333?text=${product.name.replace(/\s/g, '+')}`; }}
//                   />
//                   {product.comingSoon ? (
//                     <Badge className="absolute top-3 right-3 bg-blue-500 text-white py-1 px-3 shadow-md rotate-3 transform origin-top-right">
//                       Coming Soon!
//                     </Badge>
//                   ) : (
//                     hasDiscount ? (
//                       <Badge className="absolute top-3 right-3 bg-red-500 text-white py-1 px-3 shadow-md rotate-3 transform origin-top-right flex items-center gap-1">
//                         <Tag className="h-4 w-4" /> {product.discountPercentage}% OFF
//                       </Badge>
//                     ) : (
//                       !product.inStock && (
//                         <Badge className="absolute top-3 right-3 bg-gray-500 text-white py-1 px-3 shadow-md rotate-3 transform origin-top-right">
//                           Out of Stock
//                         </Badge>
//                       )
//                     )
//                   )}
//                 </Link>
//                 <CardContent className="p-6 flex flex-col flex-grow">
//                   <Badge className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 mb-2 py-1 px-3 shadow-sm inline-flex w-fit">
//                     {product.category}
//                   </Badge>
//                   <h3 className="text-xl font-bold text-green-950 mb-2 line-clamp-2 leading-tight">
//                     <Link to={`/products/${product.id}`} className="hover:text-green-700 transition-colors">
//                       {product.name}
//                     </Link>
//                   </h3>
//                   <p className="text-green-800 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">{product.description}</p>

//                   <div className="flex flex-col mb-4 mt-auto">
//                     {hasDiscount && (
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-500 line-through">
//                           ₹{product.price.toFixed(2)}
//                         </span>
//                         <span className="text-base text-red-600 font-semibold">
//                           Save ₹{discountedAmount.toFixed(2)}
//                         </span>
//                       </div>
//                     )}
//                     <span className="text-2xl font-bold text-green-800">
//                       {product.comingSoon ? "—" : `₹${discountedPrice.toFixed(2)}`}
//                     </span>
//                   </div>

//                   {product.inStock && !product.comingSoon ? (
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
//                         onClick={() => handleAddToCart(product.id)}
//                       >
//                         <ShoppingCart className="h-4 w-4" /> Add
//                       </Button>
//                       <Button
//                         size="sm"
//                         className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
//                         onClick={() => handleBuyNow(product)}
//                       >
//                         <ArrowRight className="h-4 w-4" /> Buy Now
//                       </Button>
//                     </div>
//                   ) : (
//                     <Badge className="bg-gray-200 text-gray-700 py-1 px-3 shadow-sm flex items-center gap-1">
//                       {product.comingSoon ? (
//                         <>
//                           <Clock className="h-4 w-4" /> Coming Soon!
//                         </>
//                       ) : (
//                         <>
//                           <Package className="h-4 w-4" /> Out of Stock
//                         </>
//                       )}
//                     </Badge>
//                   )}
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         <div className="text-center mt-20">
//           <h2 className="text-3xl font-bold text-green-950 mb-4">Ready to Grow Your Best Garden Yet?</h2>
//           <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
//             Explore our full range of organic solutions and find the perfect nourishment for your plants.
//           </p>
//           <Link to="/gardenplanner">
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <Sparkles className="mr-2 h-5 w-5" /> Get My GreenThumb Plan
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"; // Added CardHeader, CardTitle
import { Badge } from "../components/ui/Badge";
import { ShoppingCart, Package, Heart, CheckCircle, ArrowRight, Clock, Sparkles, Tag, Loader2, XCircle } from "lucide-react"; // Added Loader2, XCircle

// --- IMPORT YOUR LOCAL IMAGES HERE ---
// Ensure these paths are correct relative to this file
// import CompostR from'../assets/product-images/CompostR.JPG';
// import OrganicGarden from '../assets/product-images/OrganicGarden.JPG';
// import NPK from'../assets/product-images/NPK.jpg';


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null); // State to track which product is being added
  const [cartMessage, setCartMessage] = useState({ show: false, type: '', message: '' }); // State for success/error messages

  const navigate = useNavigate();

  // Fetch products from the backend when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5000/api/products_s'); // Your backend API URL
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(`Failed to load products: ${err.message}. Please ensure the backend server is running and accessible.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this effect runs once on mount

  const calculateDiscountedPrice = (price, discountPercentage) => {
    const actualPrice = parseFloat(price) || 0;
    const actualDiscountPercentage = parseFloat(discountPercentage) || 0;

    if (actualDiscountPercentage > 0) {
      return actualPrice * (1 - actualDiscountPercentage / 100);
    }
    return actualPrice;
  };

  // ⭐ UPDATED: handleAddToCart to use backend API
  const handleAddToCart = async (productId, quantity = 1) => {
    setAddingToCart(productId); // Set loading state for this specific product
    setCartMessage({ show: false, type: '', message: '' }); // Clear previous messages

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setCartMessage({ show: true, type: 'error', message: 'You must be logged in to add items to cart.' });
      setAddingToCart(null);
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken'); // Clear expired/invalid token
        setCartMessage({ show: true, type: 'error', message: 'Your session has expired. Please log in again.' });
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart.');
      }

      const data = await response.json();
      setCartMessage({ show: true, type: 'success', message: data.message || 'Item added to cart!' });

      // ⭐ Dispatch a custom event to notify Header and CartPage to update their counts/data
      window.dispatchEvent(new Event('cartUpdated'));

    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartMessage({ show: true, type: 'error', message: err.message || 'Error adding item to cart.' });
    } finally {
      setAddingToCart(null); // Reset loading state
      // Hide message after 3 seconds
      setTimeout(() => setCartMessage({ show: false, type: '', message: '' }), 3000);
    }
  };

  const handleBuyNow = (product) => {
    // This function can be enhanced to directly add to cart via API and then redirect
    // For now, it's navigating with query params, which is less ideal for a real e-commerce flow.
    // A better approach would be: add to cart API call, then navigate to checkout.
    console.log(`Initiating direct purchase for product ${product.id}!`);
    const priceToBuy = calculateDiscountedPrice(product.price, product.discount_percentage);
    navigate(`/checkout?productId=${product.id}&quantity=1&price=${priceToBuy}&originalPrice=${product.price}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-green-700" />
        <p className="text-xl text-green-800">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 flex-col p-4">
        <XCircle className="mr-2 h-8 w-8 text-red-600" />
        <p className="text-xl text-red-600 text-center mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 text-white mt-4">
          Retry Loading Products
        </Button>
      </div>
    );
  }

  // If no products are found after loading, display a message
  if (products.length === 0 && !loading && !error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <p className="text-xl text-green-800 mb-4">No products found. Please add products to your database.</p>
        <p className="text-md text-green-700 text-center">Ensure your backend server is running and your database tables are populated.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 py-1.5 px-4 text-base shadow-sm inline-flex">
            Our Premium Collection
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-green-950 mt-4 leading-tight">
            Nourish Your Garden, Nurture Your Home
          </h1>
          <p className="max-w-3xl mx-auto text-green-800 md:text-xl leading-relaxed mt-6">
            Discover our carefully crafted organic fertilizers, designed to bring life and vitality to every plant, from flourishing vegetables to serene indoor greens.
          </p>
        </div>

        {cartMessage.show && (
          <div className={`p-3 rounded-md text-sm flex items-center gap-2 mb-6 ${
            cartMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {cartMessage.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            {cartMessage.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            // Ensure properties are safely accessed, defaulting to empty string or 0 if null/undefined
            const productName = product.name || 'Unnamed Product';
            const productDescription = product.description || 'No description available.';
            const productCategory = product.category || 'Uncategorized';
            const productPrice = parseFloat(product.price) || 0;
            const productDiscountPercentage = parseFloat(product.discount_percentage) || 0;
            const productComingSoon = product.coming_soon === true; // Ensure boolean
            const productInStock = product.in_stock === true; // Ensure boolean

            const discountedPrice = calculateDiscountedPrice(productPrice, productDiscountPercentage);
            const hasDiscount = productDiscountPercentage > 0;
            const discountedAmount = productPrice * (productDiscountPercentage / 100);

            return (
              <Card key={product.id} className="group flex flex-col border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/70 backdrop-blur-sm overflow-hidden">
                {/* Link to single product detail page */}
                <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
                  <img
                    src={product.image_url || `https://placehold.co/400x300/cccccc/333333?text=${productName.replace(/\s/g, '+')}`} // ⭐ Changed to product.image_url
                    alt={productName}
                    width={400}
                    height={300}
                    className="w-full h-56 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/cccccc/333333?text=${productName.replace(/\s/g, '+')}`; }}
                  />
                  {productComingSoon ? (
                    <Badge className="absolute top-3 right-3 bg-blue-500 text-white py-1 px-3 shadow-md rotate-3 transform origin-top-right">
                      Coming Soon!
                    </Badge>
                  ) : (
                    hasDiscount ? (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white py-1 px-3 shadow-md rotate-3 transform origin-top-right flex items-center gap-1">
                        <Tag className="h-4 w-4" /> {productDiscountPercentage}% OFF
                      </Badge>
                    ) : (
                      !productInStock && (
                        <Badge className="absolute top-3 right-3 bg-gray-500 text-white py-1 px-3 shadow-md rotate-3 transform origin-top-right">
                          Out of Stock
                        </Badge>
                      )
                    )
                  )}
                </Link>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <Badge className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 mb-2 py-1 px-3 shadow-sm inline-flex w-fit">
                    {productCategory}
                  </Badge>
                  <h3 className="text-xl font-bold text-green-950 mb-2 line-clamp-2 leading-tight">
                    <Link to={`/products/${product.id}`} className="hover:text-green-700 transition-colors">
                      {productName}
                    </Link>
                  </h3>
                  <p className="text-green-800 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">{productDescription}</p>

                  <div className="flex flex-col mb-4 mt-auto">
                    {hasDiscount && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          ₹{productPrice.toFixed(2)}
                        </span>
                        <span className="text-base text-red-600 font-semibold">
                          Save ₹{discountedAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <span className="text-2xl font-bold text-green-800">
                      {productComingSoon ? "—" : `₹${discountedPrice.toFixed(2)}`}
                    </span>
                  </div>

                  {productInStock && !productComingSoon ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingToCart === product.id} // Disable if already adding
                      >
                        {addingToCart === product.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" /> Add
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                        onClick={() => handleBuyNow(product)}
                      >
                        <ArrowRight className="h-4 w-4" /> Buy Now
                      </Button>
                    </div>
                  ) : (
                    <Badge className="bg-gray-200 text-gray-700 py-1 px-3 shadow-sm flex items-center gap-1">
                      {productComingSoon ? (
                        <>
                          <Clock className="h-4 w-4" /> Coming Soon!
                        </>
                      ) : (
                        <>
                          <Package className="h-4 w-4" /> Out of Stock
                        </>
                      )}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-green-950 mb-4">Ready to Grow Your Best Garden Yet?</h2>
          <p className="text-lg text-green-800 max-w-2xl mx-auto mb-8">
            Explore our full range of organic solutions and find the perfect nourishment for your plants.
          </p>
          <Link to="/gardenplanner">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="mr-2 h-5 w-5" /> Get My GreenThumb Plan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

