import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Search, MapPin, Filter, Calendar, BarChart3, Briefcase, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// Mock job data
const jobListings = [
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
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Austin, TX",
    type: "Full-time",
    postedDate: "1 week ago",
    description: "We're looking for a DevOps engineer to help us build and maintain our cloud infrastructure. You should have experience with AWS, Kubernetes, and CI/CD pipelines.",
    salary: "$110K - $140K",
  },
  {
    id: "6",
    title: "Marketing Specialist",
    company: "GrowthCorp",
    location: "Remote",
    type: "Remote",
    postedDate: "3 days ago",
    description: "Join our marketing team to help drive growth and engagement. You should have experience with digital marketing, content creation, and analytics.",
    salary: "$70K - $90K",
    isNew: true,
  },
  {
    id: "7",
    title: "Backend Developer",
    company: "ServerTech",
    location: "Seattle, WA",
    type: "Full-time",
    postedDate: "2 weeks ago",
    description: "We're seeking a backend developer with experience in Node.js, Express, and MongoDB. You'll be responsible for building and maintaining our API infrastructure.",
    salary: "$100K - $130K",
  },
  {
    id: "8",
    title: "Customer Success Manager",
    company: "SupportHQ",
    location: "Denver, CO",
    type: "Full-time",
    postedDate: "4 days ago",
    description: "Help our customers get the most value from our product. You should have excellent communication skills and a passion for customer service.",
    salary: "$80K - $100K",
  },
];

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salary, setSalary] = useState("");
  
  // Filter jobs based on search criteria
  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLocation = 
      location === "" || 
      job.location.toLowerCase().includes(location.toLowerCase());
      
    const matchesJobType = 
      jobType === "" || 
      job.type.toLowerCase() === jobType.toLowerCase();
      
    return matchesSearch && matchesLocation && matchesJobType;
  });
  
  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setJobType("");
    setDatePosted("");
    setExperienceLevel("");
    setSalary("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Find Your Perfect Job</h1>
            <p className="text-muted-foreground">Browse through thousands of job listings and find your next opportunity</p>
          </div>
          
          {/* Search Bar */}
          <div className="bg-white shadow-sm rounded-xl p-4 glass mb-8 animate-fade-in">
            <form className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="text" 
                    placeholder="Job title, keywords, or company" 
                    className="pl-10 h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="h-12 px-6">
                Search Jobs
              </Button>
            </form>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm glass p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Filter size={18} className="mr-2" /> Filters
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Clear all
                  </Button>
                </div>
                
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="job-type" className="border-b-0">
                    <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                      <div className="flex items-center">
                        <Briefcase size={16} className="mr-2" /> Job Type
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {["Full-time", "Part-time", "Contract", "Remote", "Internship"].map((type) => (
                          <div 
                            key={type} 
                            className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                              jobType === type.toLowerCase() ? "bg-primary/10 text-primary" : "hover:bg-accent"
                            }`}
                            onClick={() => setJobType(type.toLowerCase())}
                          >
                            <span className="text-sm">{type}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="date-posted" className="border-b-0">
                    <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" /> Date Posted
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {["Last 24 hours", "Last week", "Last 2 weeks", "Last month"].map((date) => (
                          <div 
                            key={date} 
                            className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                              datePosted === date.toLowerCase() ? "bg-primary/10 text-primary" : "hover:bg-accent"
                            }`}
                            onClick={() => setDatePosted(date.toLowerCase())}
                          >
                            <span className="text-sm">{date}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="experience" className="border-b-0">
                    <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" /> Experience Level
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {["Entry level", "Mid level", "Senior level", "Executive"].map((exp) => (
                          <div 
                            key={exp} 
                            className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                              experienceLevel === exp.toLowerCase() ? "bg-primary/10 text-primary" : "hover:bg-accent"
                            }`}
                            onClick={() => setExperienceLevel(exp.toLowerCase())}
                          >
                            <span className="text-sm">{exp}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="salary" className="border-b-0">
                    <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                      <div className="flex items-center">
                        <BarChart3 size={16} className="mr-2" /> Salary Range
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {["$0 - $50K", "$50K - $100K", "$100K - $150K", "$150K+"].map((sal) => (
                          <div 
                            key={sal} 
                            className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                              salary === sal.toLowerCase() ? "bg-primary/10 text-primary" : "hover:bg-accent"
                            }`}
                            onClick={() => setSalary(sal.toLowerCase())}
                          >
                            <span className="text-sm">{sal}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            
            {/* Job Listings */}
            <div className="lg:w-3/4">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground">
                        Search: {searchTerm}
                      </Badge>
                    )}
                    {location && (
                      <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground">
                        Location: {location}
                      </Badge>
                    )}
                    {jobType && (
                      <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground">
                        Type: {jobType}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                  <Select>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by: Relevance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Sort by: Relevance</SelectItem>
                      <SelectItem value="date">Sort by: Date</SelectItem>
                      <SelectItem value="salary-high">Sort by: Salary (High to Low)</SelectItem>
                      <SelectItem value="salary-low">Sort by: Salary (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => (
                    <div key={job.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <JobCard {...job} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No jobs match your search criteria. Try adjusting your filters.</p>
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
              
              {filteredJobs.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline">Load More Jobs</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobSearch;