import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobPostForm from "@/components/JobPostForm";
import { useAuth } from "@/contexts/AuthContext";

const JobPost = () => {
  const { isAuthenticated, isRecruiter, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and redirect if needed
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/auth", { replace: true });
      } else if (!isRecruiter) {
        navigate("/setup-profile", { replace: true });
      }
    }
  }, [isAuthenticated, isRecruiter, isLoading, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Post a Job</h1>
            <p className="text-muted-foreground">Reach thousands of qualified candidates for free</p>
          </div>
          
          <div className="glass rounded-xl shadow-sm p-6 md:p-8 animate-fade-in">
            <JobPostForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobPost;