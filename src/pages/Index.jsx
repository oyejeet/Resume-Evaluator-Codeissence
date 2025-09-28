import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import JobPlacard from "@/components/JobPlacard";
import { Search, User, Building, ChevronRight, BriefcaseBusiness, Clock, Bell, Pencil, Calendar, Mail, Users, BarChart3, MapPin } from "lucide-react";

const featuredJobsList = [
  { 
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    postedDate: "3 days ago",
    description: "We're looking for a senior frontend developer with 5+ years of experience with React, TypeScript, and modern web technologies. You'll be responsible for building user interfaces for our enterprise products.",
    salary: "$120K - $150K",
    isNew: true,
  },
  { 
    id: "2",
    title: "Product Manager",
    company: "InnovateTech",
    location: "New York, NY",
    type: "Full-time",
    postedDate: "1 week ago",
    description: "Join our product team to drive the strategy and development of our SaaS platform. You'll work closely with engineering, design, and marketing to ensure we're building the right product.",
    salary: "$110K - $140K",
  },
  { 
    id: "3",
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "Remote",
    type: "Remote",
    postedDate: "2 days ago",
    description: "We're seeking a skilled UX/UI designer to create beautiful, intuitive interfaces for our clients. You should have a strong portfolio and experience with Figma and design systems.",
    salary: "$90K - $120K",
    isNew: true,
  },
  { 
    id: "4",
    title: "Data Scientist",
    company: "DataWorks",
    location: "Chicago, IL",
    type: "Contract",
    postedDate: "5 days ago",
    description: "Help us extract insights from data using statistical methods and machine learning. You should be proficient in Python, SQL, and have experience with data visualization tools.",
    salary: "$100K - $130K",
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isPlacardOpen, setIsPlacardOpen] = useState(false);
  // Animation on scroll effects
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsPlacardOpen(true);
  };

  const handlePlacardClose = () => {
    setIsPlacardOpen(false);
    setSelectedJob(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you'd navigate to a search results page
    // For this example, we're just filtering the list on the homepage
    console.log("Searching for:", searchQuery, "in", locationQuery);
  };
  
  const filteredJobs = featuredJobsList.filter(job => {
    const queryMatch = (job.title + job.company + job.description)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const locationMatch = job.location
      .toLowerCase()
      .includes(locationQuery.toLowerCase());
    return queryMatch && locationMatch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-theme-black via-theme-darker to-theme-black pt-32 pb-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-theme-green to-theme-purple rounded-full opacity-15"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-theme-cyan to-theme-green rounded-full opacity-15"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-theme-orange to-theme-purple rounded-full opacity-10"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slide-up">
                Connecting Talent <span className="bg-gradient-to-r from-theme-green via-theme-cyan to-theme-purple bg-clip-text text-transparent">Without</span> Financial Barriers
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                A free platform that bridges the gap between job seekers and recruiters, 
                ensuring a seamless hiring experience for all.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-theme-dark via-theme-black to-theme-darker shadow-md rounded-xl p-4 max-w-4xl mx-auto glass animate-scale-in border border-theme-green/30 shadow-theme-green/20">
              <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSearch}>
                <div className="flex-grow">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      type="text" 
                      placeholder="Job title, keywords, or company" 
                      className="pl-10 h-12"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:w-1/3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      type="text" 
                      placeholder="Location" 
                      className="pl-10 h-12"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="h-12 px-6">
                  Search Jobs
                </Button>
              </form>
            </div>
          </div>
        </section>
        
        {/* Featured Jobs Section */}
        <section className="py-16 bg-theme-black">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold">Featured Jobs</h2>
              <Link to="/jobs" className="text-sm text-primary flex items-center hover:underline">
                View all jobs <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <JobCard 
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    type={job.type}
                    postedDate={job.postedDate}
                    description={job.description}
                    salary={job.salary}
                    isNew={job.isNew}
                    onViewJob={() => handleViewJob(job)}
                  />
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 text-center py-10">
                  <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gradient-to-r from-theme-darker to-theme-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Features for Everyone
              </h2>
              <p className="text-muted-foreground">
                Our platform provides powerful tools for both job seekers and recruiters,
                all completely free of charge.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="glass rounded-xl p-8 animate-fade-in">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <User className="mr-2 text-primary" /> For Job Seekers
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Profile & Resume Management</h4>
                      <p className="text-sm text-muted-foreground">Create professional profiles and upload resumes easily</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <Search size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Smart Job Search</h4>
                      <p className="text-sm text-muted-foreground">Find jobs using filters like location, experience, and industry</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Application Tracking</h4>
                      <p className="text-sm text-muted-foreground">Monitor job application statuses in real-time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <Pencil size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Resume Builder</h4>
                      <p className="text-sm text-muted-foreground">Create and customize resumes using our integrated tool</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Interview Scheduling</h4>
                      <p className="text-sm text-muted-foreground">Manage appointments with a built-in calendar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Job Alerts & Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get real-time updates on job postings and applications</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-xl p-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Building className="mr-2 text-primary" /> For Recruiters
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <BriefcaseBusiness size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Free Job Posting</h4>
                      <p className="text-sm text-muted-foreground">Post and manage job listings at no cost</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <Search size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Candidate Search</h4>
                      <p className="text-sm text-muted-foreground">Filter candidates by skills, experience, and qualifications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <BriefcaseBusiness size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Application Dashboard</h4>
                      <p className="text-sm text-muted-foreground">Review and manage applications efficiently</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Automated Communication</h4>
                      <p className="text-sm text-muted-foreground">Send real-time updates to candidates via email</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Collaborative Hiring Tools</h4>
                      <p className="text-sm text-muted-foreground">Enable teamwork for managing listings and candidates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Gain Insights</h4>
                      <p className="text-sm text-muted-foreground">Gain insights from job post engagement and candidate activity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-16 bg-gradient-to-r from-theme-green via-theme-cyan to-theme-purple">
          <div className="container mx-auto px-4 text-center text-theme-black">
            <h2 className="text-3xl font-bold mb-4">Ready to find your next opportunity?</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Join CareerCraft today and take the next step in your career. 
              Our platform is free for everyone.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />

      {isPlacardOpen && selectedJob && (
        <JobPlacard
          job={selectedJob}
          isOpen={isPlacardOpen}
          onClose={handlePlacardClose}
        />
      )}
    </div>
  );
};

export default Index;