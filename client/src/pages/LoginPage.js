import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { LogIn, Mail, Lock, Phone, CheckCircle } from 'lucide-react';

function LoginPage() {
 const navigate = useNavigate();
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Use loginIdentifier for email/phone
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status

  const handleLogin = async (e) => { // Make function async
    e.preventDefault();
    setLoginError('');
    setLoginSuccess(false);
    setIsSubmitting(true); // Set submitting to true

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginIdentifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token); // ⭐ Store the JWT
        // Optionally store user data as well if needed immediately without another API call
        localStorage.setItem('userData', JSON.stringify(data.user)); // Store basic user data
        setLoginSuccess(true);
        setTimeout(() => {
          navigate('/accountpage');
        }, 1500);
      } else {
        setLoginError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Network error. Could not connect to the server.');
    } finally {
      setIsSubmitting(false); // Reset submitting
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter flex items-center justify-center">
      <Card className="max-w-md w-full border-green-200 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-green-950 text-3xl font-extrabold flex items-center justify-center gap-2">
            <LogIn className="h-8 w-8" /> Log In 
          </CardTitle>
          <p className="text-green-800 mt-2">Access your personalized gardening dashboard.</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="loginIdentifier" className="block text-sm font-medium text-green-900 mb-1">Email Address or Phone Number</label>
              <Input
                type="text" // Type text as it can be email or phone
                id="loginIdentifier"
                placeholder="you@example.com or 123-456-7890"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
                icon={
                  loginIdentifier.includes('@') ?
                  <Mail className="h-4 w-4 text-green-600" /> :
                  <Phone className="h-4 w-4 text-green-600" />
                }
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
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {loginError}
              </div>
            )}

            {loginSuccess && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Login successful! Redirecting...
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Log In
            </Button>
          </form>

          <p className="mt-6 text-center text-green-800 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-700 hover:underline font-semibold">
              Register here
            </Link>
          </p>
          <p className="mt-2 text-center text-green-800 text-sm">
            <Link to="/forgot-password" className="text-green-700 hover:underline font-semibold">
              Forgot password?
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
