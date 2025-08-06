import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { User, Mail, Phone, Save, ArrowLeft,CheckCircle } from "lucide-react";

function ProfileEditPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");
      const authToken = localStorage.getItem("authToken"); // ⭐ Get the JWT

      if (!authToken) {
        navigate("/login"); // Redirect if not authenticated
        return;
      }

      try {
        // ⭐ Make authenticated API call to fetch user profile
        const response = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${authToken}`, // ⭐ Send JWT in Authorization header
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch profile data.");
        }

        const data = await response.json();
        setFullName(data.fullName);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile. Please log in again.");
        localStorage.removeItem("authToken"); // Clear token if fetch fails
        localStorage.removeItem("userData");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    const authToken = localStorage.getItem("authToken"); // ⭐ Get the JWT
    if (!authToken) {
      setError("You are not logged in.");
      setIsSubmitting(false);
      navigate("/login");
      return;
    }

    if (!fullName || !email || !phoneNumber) {
      setError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // ⭐ Make authenticated API call to update user profile
      const response = await fetch(
        "http://localhost:5000/api/user/profile/update",
        {
          method: "PUT", // Or PATCH
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // ⭐ Send JWT in Authorization header
          },
          body: JSON.stringify({ fullName, email, phoneNumber }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile.");
      }

      setSuccessMessage("Profile updated successfully!");
      // Update local storage if you stored user data there
      const currentUserData = JSON.parse(localStorage.getItem("userData"));
      if (currentUserData) {
        localStorage.setItem(
          "userData",
          JSON.stringify({ ...currentUserData, fullName, email, phoneNumber })
        );
      }

      setTimeout(() => {
        navigate("/accountpage");
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter flex items-center justify-center">
        <p className="text-green-800 text-lg">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter flex items-center justify-center">
      <Card className="max-w-md w-full border-green-200 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-green-950 text-3xl font-extrabold flex items-center justify-center gap-2">
            <User className="h-8 w-8" /> Edit Your Profile
          </CardTitle>
          <p className="text-green-800 mt-2">
            Update your personal information.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-green-900 mb-1"
              >
                Full Name
              </label>
              <Input
                type="text"
                id="fullName"
                placeholder="Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                icon={<User className="h-4 w-4 text-green-600" />}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-green-900 mb-1"
              >
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="h-4 w-4 text-green-600" />}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-green-900 mb-1"
              >
                Phone Number
              </label>
              <Input
                type="tel"
                id="phoneNumber"
                placeholder="e.g., 123-456-7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                icon={<Phone className="h-4 w-4 text-green-600" />}
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> {successMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/accountpage")}
              variant="outline"
              className="w-full mt-4 border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileEditPage;
