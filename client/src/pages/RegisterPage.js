import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { UserPlus, User, Mail, Lock, Phone, CheckCircle } from 'lucide-react'; // Import Phone icon

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    setRegistrationSuccess(false);
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setRegistrationError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    // New validation: Ensure phone number is not empty
    if (!phoneNumber) {
      setRegistrationError('Phone number is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', { // Ensure this matches your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, phoneNumber, password }), // Include phoneNumber
      });

      const data = await response.json();

      if (response.ok) {
        setRegistrationSuccess(true);
        // Reset form fields on successful registration
        setFullName('');
        setEmail('');
        setPhoneNumber(''); // Clear phone number field
        setPassword('');
        setConfirmPassword('');

        localStorage.setItem('mockAuthToken', 'loggedIn');
        setTimeout(() => {
          navigate('/accountpage');
        }, 1500);
      } else {
        setRegistrationError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setRegistrationError('Network error. Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter flex items-center justify-center">
      <Card className="max-w-md w-full border-green-200 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-green-950 text-3xl font-extrabold flex items-center justify-center gap-2">
            <UserPlus className="h-8 w-8" /> Create Your Account
          </CardTitle>
          <p className="text-green-800 mt-2">Join The Good Soil Co. community today!</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-green-900 mb-1">Full Name</label>
              <Input
                type="text"
                id="fullName"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                icon={<User className="h-4 w-4 text-green-600" />}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-green-900 mb-1">Email Address</label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="h-4 w-4 text-green-600" />}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-green-900 mb-1">Phone Number</label> {/* Label change */}
              <Input
                type="tel" // Use type="tel" for phone numbers
                id="phoneNumber"
                placeholder="e.g., 123-456-7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required // Make phone number required
                icon={<Phone className="h-4 w-4 text-green-600" />}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-green-900 mb-1">Password</label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="h-4 w-4 text-green-600" />}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-green-900 mb-1">Confirm Password</label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                icon={<Lock className="h-4 w-4 text-green-600" />}
                disabled={isSubmitting}
              />
            </div>

            {registrationError && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {registrationError}
              </div>
            )}

            {registrationSuccess && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Registration successful! Redirecting...
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <p className="mt-6 text-center text-green-800 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 hover:underline font-semibold">
              Log in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;