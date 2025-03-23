import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileForm from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SetupProfile = () => {
  const { isAuthenticated, isLoading, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isRecruiter, setIsRecruiter] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/auth" />;
  }

  const handleAccountTypeToggle = (checked) => {
    setIsRecruiter(checked);
  };

  const handleProfileSubmit = async (profileData) => {
    try {
      // Include the account type in the profile data
      await updateUserProfile({
        ...profileData,
        is_recruiter: isRecruiter,
      });

      // Redirect based on account type
      if (isRecruiter) {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/job-seeker-dashboard");
      }
    } catch (error) {
      console.error("Error setting up profile:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Set Up Your Profile</h1>
            <p className="text-muted-foreground">Complete your profile to get started</p>
          </div>

          <div className="glass rounded-xl shadow-sm p-6 md:p-8 animate-fade-in">
            <div className="mb-8 p-4 bg-secondary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium mb-1">Account Type</h3>
                  <p className="text-sm text-muted-foreground">
                    Select whether you're looking for a job or hiring
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="account-type" className={!isRecruiter ? "font-semibold" : ""}>
                    Job Seeker
                  </Label>
                  <Switch id="account-type" checked={isRecruiter} onCheckedChange={handleAccountTypeToggle} />
                  <Label htmlFor="account-type" className={isRecruiter ? "font-semibold" : ""}>
                    Recruiter
                  </Label>
                </div>
              </div>
            </div>

            <ProfileForm onSubmit={handleProfileSubmit} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SetupProfile;
