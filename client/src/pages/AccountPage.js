// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button } from '../components/ui/Button';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
// import { User, LogIn, UserPlus, Package, Settings } from 'lucide-react'; // Added Settings icon

// function AccountPage() {
//    const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userData, setUserData] = useState({
//     fullName: 'Guest',
//     email: '',
//     phoneNumber: '',
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       setLoading(true);
//       setError('');
//       const authToken = localStorage.getItem('authToken'); // ⭐ Get the JWT

//       if (authToken) {
//         try {
//           // ⭐ Make authenticated API call to fetch user profile
//           const response = await fetch('http://localhost:5000/api/user/profile', {
//             headers: {
//               'Authorization': `Bearer ${authToken}`, // ⭐ Send JWT in Authorization header
//             },
//           });

//           if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Failed to fetch user profile.');
//           }

//           const data = await response.json();
//           setUserData(data); // Set fetched user data
//           setIsAuthenticated(true);
//         } catch (err) {
//           console.error('Failed to fetch user data:', err);
//           setError(err.message || 'Failed to load user profile. Please log in again.');
//           setIsAuthenticated(false);
//           localStorage.removeItem('authToken'); // Clear token if fetch fails
//           localStorage.removeItem('userData'); // Clear stored mock data
//           navigate('/login'); // Redirect to login
//         }
//       } else {
//         setIsAuthenticated(false);
//         setUserData({ fullName: 'Guest', email: '', phoneNumber: '' });
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, [navigate]); // Add navigate to dependency array

//   const handleLogout = () => {
//     localStorage.removeItem('authToken'); // ⭐ Remove JWT
//     localStorage.removeItem('userData'); // Remove any stored mock data
//     setIsAuthenticated(false);
//     setUserData({ fullName: 'Guest', email: '', phoneNumber: '' });
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter flex items-center justify-center">
//         <p className="text-green-800 text-lg">Loading account details...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
//       <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-green-200">
//          <div className="text-center mb-10">
//           <h1 className="text-4xl font-extrabold text-green-950 flex items-center justify-center gap-3">
//             <User className="h-10 w-10 text-green-700" />
//             {isAuthenticated ? `Welcome, ${userData.fullName}` : 'My Account'}
//           </h1>
//           <p className="text-green-800 text-lg mt-3">
//             {isAuthenticated ? 'Manage your garden details and orders.' : 'Log in or register to access your account.'}
//           </p>
//           {error && (
//             <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm mt-4">
//               {error}
//             </div>
//           )}
//         </div>

//         {isAuthenticated ? (
//           <div className="space-y-6">
//             <Card className="border-green-200 shadow-md bg-white/80 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="text-green-950 flex items-center gap-2">
//                   <Package className="h-6 w-6" /> Your Orders
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <p className="text-green-800 mb-4">View the status of your past and current orders.</p>
//                 <Link to="/orderhistory">
//                   <Button className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white">
//                     View Orders
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             <Card className="border-green-200 shadow-md bg-white/80 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="text-green-950 flex items-center gap-2">
//                   <Settings className="h-6 w-6" /> Profile Settings
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <p className="text-green-800 mb-4">Update your personal information and preferences.</p>
//                 <Button
//                   className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white"
//                   onClick={() => navigate('/edit-profile')} // Navigate to new edit profile page
//                 >
//                   Edit Profile
//                 </Button>
//               </CardContent>
//             </Card>

//             <Button
//               onClick={handleLogout}
//               className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg shadow-md"
//             >
//               Log Out
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <Card className="border-green-200 shadow-md bg-white/80 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="text-green-950 flex items-center gap-2">
//                   <LogIn className="h-6 w-6" /> Log In
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <p className="text-green-800 mb-4">Already have an account? Welcome back!</p>
//                 <Link to="/login">
//                   <Button className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white">
//                     Log In
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             <Card className="border-green-200 shadow-md bg-white/80 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="text-green-950 flex items-center gap-2">
//                   <UserPlus className="h-6 w-6" /> Create Account
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <p className="text-green-800 mb-4">New to The Good Soil Co.? Register here.</p>
//                 <Link to="/register">
//                   <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
//                     Register
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AccountPage;

// src/pages/AccountPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, LogIn, UserPlus, Package, Loader2, XCircle, Mail, Phone, Calendar } from 'lucide-react'; // Added icons for user details

function AccountPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState(''); // New state for user email
  const [userPhone, setUserPhone] = useState(''); // New state for user phone
  const [userCreatedAt, setUserCreatedAt] = useState(''); // New state for user creation date
  const [loading, setLoading] = useState(true); // New loading state for data fetch
  const [error, setError] = useState(''); // New state for error messages

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(''); // Clear previous errors
      const authToken = localStorage.getItem('authToken'); // ⭐ Get the JWT token

      if (!authToken) {
        setIsAuthenticated(false);
        setLoading(false);
        setUserName('Guest');
        // Optionally, redirect to login if not authenticated and trying to access this page
        // navigate('/login');
        return;
      }

      try {
        // ⭐ Make authenticated API call to fetch user profile
        const response = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${authToken}`, // ⭐ Send JWT in Authorization header
          },
        });

        if (response.status === 401 || response.status === 403) {
            // Token expired or invalid, or user not authorized
            localStorage.removeItem('authToken'); // Clear invalid token
            setIsAuthenticated(false);
            setUserName('Guest');
            setError('Your session has expired or is invalid. Please log in again.');
            navigate('/login'); // Redirect to login
            return;
        }

        const data = await response.json();

        if (response.ok) {
          setIsAuthenticated(true);
          setUserName(data.fullName || 'User'); // Use actual full name from backend
          setUserEmail(data.email || ''); // Set user email
          setUserPhone(data.phoneNumber || ''); // Set user phone
          setUserCreatedAt(data.createdAt ? new Date(data.createdAt).toLocaleDateString() : ''); // Format date
        } else {
          setIsAuthenticated(false);
          setUserName('Guest');
          setError(data.message || 'Failed to fetch user data. Please try again.');
          // If the error explicitly says "User not found", it means token is valid but user ID from token doesn't match a DB entry
          if (data.message === "User not found.") {
              localStorage.removeItem('authToken'); // Clear the token as it leads to non-existent user
              navigate('/login'); // Redirect to login
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setIsAuthenticated(false);
        setUserName('Guest');
        setError('Network error or server unavailable. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]); // Added navigate to dependency array

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // ⭐ Clear the actual JWT token
    setIsAuthenticated(false);
    setUserName('Guest');
    setUserEmail('');
    setUserPhone('');
    setUserCreatedAt('');
    navigate('/login'); // Redirect to login page after logout
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-green-700" />
        <p className="text-green-800 text-lg">Loading account details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-green-950 mb-10 drop-shadow-sm">
          My Account
        </h1>

        {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm flex items-center gap-2 mb-6">
                <XCircle className="h-5 w-5" /> {error}
            </div>
        )}

        {isAuthenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Profile Card */}
            <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-950 flex items-center gap-2">
                  <User className="h-6 w-6" /> Welcome, {userName}!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-green-800">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-700" />
                  <span>Email: {userEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-700" />
                  <span>Phone: {userPhone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-700" />
                  <span>Member Since: {userCreatedAt || 'N/A'}</span>
                </div>

                <div className="pt-4 border-t border-green-200 flex flex-col gap-3">
                    <Link to="/edit-profile">
                        <Button className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white">
                            Edit Profile
                        </Button>
                    </Link>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-red-600 text-red-600 hover:bg-red-50"
                    >
                        Log Out
                    </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Orders Card */}
            <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-950 flex items-center gap-2">
                  <Package className="h-6 w-6" /> My Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-green-800 mb-4">View your past orders and their status.</p>
                <Link to="/orderhistory">
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                    View Order History
                  </Button>
                </Link>
                {/* Example of recent order (you'd fetch this from backend) */}
                <div className="mt-6 p-4 border border-green-200 rounded-lg bg-green-50">
                    <h4 className="font-semibold text-green-900 mb-2">Recent Order:</h4>
                    <p className="text-sm text-green-800">Order ID: ORD12345</p>
                    <p className="text-sm text-green-800">Date: July 20, 2025</p>
                    <p className="text-sm text-green-800">Status: Shipped</p>
                    <Link to="/order-details/ORD12345" className="text-green-700 hover:underline text-sm mt-2 block">
                        View Details
                    </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Log In Card */}
            <Card className="border-green-200 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-950 flex items-center gap-2">
                  <LogIn className="h-6 w-6" /> Log In
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-green-800 mb-4">Already have an account? Welcome back!</p>
                <Link to="/login">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white">
                    Log In
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Create Account Card */}
            <Card className="border-green-200 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-950 flex items-center gap-2">
                  <UserPlus className="h-6 w-6" /> Create Account
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-green-800 mb-4">New to The Good Soil Co.? Register here.</p>
                <Link to="/register">
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                    Register
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountPage;