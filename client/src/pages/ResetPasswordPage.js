// src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams 
    ,Link
} from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Lock, CheckCircle } from 'lucide-react';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to get URL query params
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Extract token from URL query parameters (e.g., /reset-password?token=YOUR_TOKEN)
    const resetToken = searchParams.get('token');
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError('Password reset token is missing or invalid.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    if (!token) {
      setError('No reset token found.');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) { // Basic password length validation
      setError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Your password has been reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after successful reset
        }, 3000);
      } else {
        setError(data.message || 'Password reset failed. Please try again.');
      }
    } catch (err) {
      console.error('Reset password request error:', err);
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
              <Lock className="h-8 w-8 text-green-700" /> Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!token && (
              <p className="text-center text-red-700 mb-4">
                {error || 'Invalid or missing password reset link.'}
              </p>
            )}
            {token && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    icon={<Lock className="h-4 w-4 text-green-600" />}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    icon={<Lock className="h-4 w-4 text-green-600" />}
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
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}
            <p className="mt-6 text-center text-green-800 text-sm">
              <Link to="/login" className="text-green-700 hover:underline font-semibold">
                Back to Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResetPasswordPage;