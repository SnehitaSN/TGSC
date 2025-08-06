// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Mail, Send, CheckCircle } from 'lucide-react';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    if (!email) {
      setError('Please enter your email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Important: Always show a generic success message to avoid
        // leaking information about valid email addresses.
        setMessage('If an account with that email exists, a password reset link has been sent to your inbox.');
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password request error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-md mx-auto">
        <Card className="border-green-200 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-green-950 text-3xl font-bold flex items-center justify-center gap-3">
              <Send className="h-8 w-8 text-green-700" /> Forgot Password
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-center text-green-800 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail className="h-4 w-4 text-green-600" />}
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> {message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <p className="mt-6 text-center text-green-800 text-sm">
              Remembered your password?{' '}
              <Link to="/login" className="text-green-700 hover:underline font-semibold">
                Log In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;