import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart3, Briefcase, Calendar, Clock, Eye, FileText, Filter, MapPin, MessageCircle, Plus, Search, Star, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

// Mock data for job listings
const jobListings = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    type: "Full-time",
    datePosted: "September 15, 2023",
    applicants: 24,
    views: 187,
    status: "Active",
  },
  {
    id: "2",
    title: "UX/UI Designer",
    location: "Remote",
    type: "Remote",
    datePosted: "September 10, 2023",
    applicants: 18,
    views: 143,
    status: "Active",
  },
  {
    id: "3",
    title: "Product Manager",
    location: "New York, NY",
    type: "Full-time",
    datePosted: "August 28, 2023",
    applicants: 32,
    views: 256,
    status: "Closed",
  },
];

// Mock data for candidates
const candidates = [
  {
    id: "1",
    name: "Emily Johnson",
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    appliedFor: "Senior Frontend Developer",
    appliedDate: "September 16, 2023",
    status: "New",
    skills: ["React", "TypeScript", "CSS", "JavaScript"],
    experience: "7 years",
    education: "B.S. Computer Science, Stanford University",
    rating: 4.5,
    avatar: "",
  },
  {
    id: "2",
    name: "Michael Williams",
    title: "UX/UI Designer",
    location: "Los Angeles, CA",
    appliedFor: "UX/UI Designer",
    appliedDate: "September 12, 2023",
    status: "Reviewed",
    skills: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
    experience: "5 years",
    education: "B.A. Design, Rhode Island School of Design",
    rating: 4.0,
    avatar: "",
  },
  {
    id: "3",
    name: "David Martinez",
    title: "Product Manager",
    location: "Chicago, IL",
    appliedFor: "Product Manager",
    appliedDate: "September 5, 2023",
    status: "Interview",
    skills: ["Product Strategy", "Agile", "User Research", "Roadmapping"],
    experience: "6 years",
    education: "MBA, University of Chicago",
    rating: 4.8,
    avatar: "",
  },
  {
    id: "4",
    name: "Sarah Thompson",
    title: "Senior Frontend Developer",
    location: "Boston, MA",
    appliedFor: "Senior Frontend Developer",
    appliedDate: "September 18, 2023",
    status: "New",
    skills: ["Vue.js", "React", "JavaScript", "HTML/CSS"],
    experience: "6 years",
    education: "B.S. Computer Science, MIT",
    rating: 4.2,
    avatar: "",
  },
];

// Mock data for analytics
const analytics = {
  jobViews: {
    total: 586,
    change: 12.5,
    data: [20, 40, 30, 45, 60, 55, 70, 80, 75, 85, 90, 100]
  },
  applications: {
    total: 74,
    change: 8.2,
    data: [5, 8, 6, 10, 12, 9, 14, 15, 10, 12, 16, 18]
  },
  interviews: {
    total: 18,
    change: -3.5,
    data: [2, 3, 1, 2, 3, 2, 4, 3, 2, 1, 3, 2]
  },
  conversionRate: {
    value: "24.3%",
    change: 5.7,
  }
};

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const navigate = useNavigate();

  // Fetch posted jobs from Supabase
  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        setLoading(true);
        const { data: jobs, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching jobs:', error);
          setError(error.message);
        } else {
          setPostedJobs(jobs || []);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchPostedJobs();
  }, []);

  // Function to fetch applicants for a specific job
  const fetchJobApplicants = async (jobId) => {
    try {
      setLoadingApplicants(true);
      
      // First, fetch applications for the job
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId);

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
        setError(applicationsError.message);
        return;
      }

      if (applications && applications.length > 0) {
        // Get all applicant IDs
        const applicantIds = applications.map(app => app.applicant_id);
        
        // Fetch profiles for all applicants
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', applicantIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setError(profilesError.message);
          return;
        }

        // Combine applications with profile data
        const applicationsWithProfiles = applications.map(application => {
          const profile = profiles.find(p => p.id === application.applicant_id);
          return {
            ...application,
            applicant: profile || null
          };
        });

        console.log('Applications with profiles:', applicationsWithProfiles);
        setJobApplicants(applicationsWithProfiles);
      } else {
        setJobApplicants([]);
      }
    } catch (err) {
      console.error('Error fetching job applicants:', err);
      setError('Failed to fetch job applicants');
    } finally {
      setLoadingApplicants(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-theme-black via-theme-darker to-theme-black">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-theme-green via-theme-cyan to-theme-purple bg-clip-text text-transparent">Recruiter Dashboard</h1>
              <p className="text-theme-green/80">Welcome back, Tech Innovations Inc.</p>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Users size={16} />
                Candidates
              </Button>
              <Button size="sm" className="flex items-center gap-2" onClick={() => navigate('/post-job')}>
                <Plus size={16} />
                Post Job
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full bg-theme-dark/80 backdrop-blur-sm border border-theme-green/20 shadow-lg mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-theme-green data-[state=active]:text-theme-black data-[state=active]:shadow-lg">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="jobs" className="data-[state=active]:bg-theme-green data-[state=active]:text-theme-black data-[state=active]:shadow-lg">
                <Briefcase className="h-4 w-4 mr-2" />
                Job Listings
              </TabsTrigger>
              <TabsTrigger value="candidates" className="data-[state=active]:bg-theme-green data-[state=active]:text-theme-black data-[state=active]:shadow-lg">
                <Users className="h-4 w-4 mr-2" />
                Candidates
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-fade-in space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-green/20 shadow-lg hover:shadow-theme-green/10 transition-all duration-300 group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-theme-green/80">Job Views</CardDescription>
                      <div className="p-2 bg-theme-green/10 rounded-lg">
                        <Eye className="h-4 w-4 text-theme-green" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-theme-green">
                      {analytics.jobViews.total}
                      <span className={`ml-2 text-sm font-normal ${analytics.jobViews.change >= 0 ? 'text-theme-green' : 'text-theme-orange'}`}>
                        {analytics.jobViews.change >= 0 ? '+' : ''}{analytics.jobViews.change}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 flex items-end space-x-1">
                      {analytics.jobViews.data.map((value, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-t from-theme-green to-theme-green-light hover:from-theme-green-light hover:to-theme-green transition-all duration-300 rounded-sm w-full group-hover:scale-105"
                          style={{ height: `${value}%` }}
                        ></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-cyan/20 shadow-lg hover:shadow-theme-cyan/10 transition-all duration-300 group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-theme-cyan/80">Applications</CardDescription>
                      <div className="p-2 bg-theme-cyan/10 rounded-lg">
                        <FileText className="h-4 w-4 text-theme-cyan" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-theme-cyan">
                      {analytics.applications.total}
                      <span className={`ml-2 text-sm font-normal ${analytics.applications.change >= 0 ? 'text-theme-cyan' : 'text-theme-orange'}`}>
                        {analytics.applications.change >= 0 ? '+' : ''}{analytics.applications.change}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 flex items-end space-x-1">
                      {analytics.applications.data.map((value, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-t from-theme-cyan to-theme-cyan-light hover:from-theme-cyan-light hover:to-theme-cyan transition-all duration-300 rounded-sm w-full group-hover:scale-105"
                          style={{ height: `${value * 5}%` }}
                        ></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-purple/20 shadow-lg hover:shadow-theme-purple/10 transition-all duration-300 group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-theme-purple/80">Interviews</CardDescription>
                      <div className="p-2 bg-theme-purple/10 rounded-lg">
                        <Calendar className="h-4 w-4 text-theme-purple" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-theme-purple">
                      {analytics.interviews.total}
                      <span className={`ml-2 text-sm font-normal ${analytics.interviews.change >= 0 ? 'text-theme-purple' : 'text-theme-orange'}`}>
                        {analytics.interviews.change >= 0 ? '+' : ''}{analytics.interviews.change}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 flex items-end space-x-1">
                      {analytics.interviews.data.map((value, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-t from-theme-purple to-theme-purple-light hover:from-theme-purple-light hover:to-theme-purple transition-all duration-300 rounded-sm w-full group-hover:scale-105"
                          style={{ height: `${value * 25}%` }}
                        ></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-orange/20 shadow-lg hover:shadow-theme-orange/10 transition-all duration-300 group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-theme-orange/80">Conversion Rate</CardDescription>
                      <div className="p-2 bg-theme-orange/10 rounded-lg">
                        <BarChart3 className="h-4 w-4 text-theme-orange" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-theme-orange">
                      {analytics.conversionRate.value}
                      <span className={`ml-2 text-sm font-normal ${analytics.conversionRate.change >= 0 ? 'text-theme-orange' : 'text-theme-cyan'}`}>
                        {analytics.conversionRate.change >= 0 ? '+' : ''}{analytics.conversionRate.change}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 w-full bg-theme-black/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-theme-orange to-theme-orange-light rounded-full transition-all duration-1000 ease-out"
                        style={{ width: analytics.conversionRate.value }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Recent Job Listings</h3>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground mt-2">Loading jobs...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-4">
                        <p className="text-red-500">Error: {error}</p>
                      </div>
                    ) : postedJobs.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No jobs posted yet</p>
                      </div>
                    ) : (
                      postedJobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-green/20 rounded-xl p-6 hover:border-theme-green/40 hover:shadow-theme-green/10 transition-all duration-300 group">
                          <div className="flex flex-col md:flex-row justify-between items-start">
                            <div className="mb-4 md:mb-0 flex-1">
                              <h4 className="font-semibold text-theme-green mb-2 text-lg">{job.title}</h4>
                              <div className="flex flex-wrap items-center text-sm text-theme-green/70 gap-3 mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.location}
                                </span>
                                <span>•</span>
                                <span className="px-2 py-1 bg-theme-green/10 text-theme-green rounded-full text-xs">
                                  {job.job_type || 'Full-time'}
                                </span>
                              </div>
                              <p className="text-theme-green/60 text-sm line-clamp-2">{job.description}</p>
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center bg-theme-cyan/10 px-3 py-1 rounded-full">
                                  <Users size={14} className="text-theme-cyan mr-1" />
                                  <span className="text-sm text-theme-cyan font-medium">{job.applications_count || 0} applicants</span>
                                </div>
                                <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  job.status === 'active' 
                                    ? 'bg-theme-green/20 text-theme-green border border-theme-green/30' 
                                    : 'bg-theme-silver/20 text-theme-silver border border-theme-silver/30'
                                }`}>
                                  {job.status || 'Active'}
                                </Badge>
                              </div>
                              <Button 
                                className="bg-gradient-to-r from-theme-green to-theme-green-light text-theme-black hover:from-theme-green-light hover:to-theme-green transition-all duration-300 shadow-lg hover:shadow-theme-green/20"
                                size="sm"
                                onClick={() => {
                                  setSelectedJob(job);
                                  fetchJobApplicants(job.id);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="glass rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">
                      {selectedJob ? `Candidates for ${selectedJob.title}` : 'Recent Candidates'}
                    </h3>
                    {selectedJob && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary"
                        onClick={() => {
                          setSelectedJob(null);
                          setJobApplicants([]);
                        }}
                      >
                        Show All
                      </Button>
                    )}
                    {!selectedJob && (
                      <Button variant="ghost" size="sm" className="text-primary">
                        View All
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {selectedJob ? (
                      // Show applicants for selected job
                      loadingApplicants ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="text-muted-foreground mt-2">Loading applicants...</p>
                        </div>
                      ) : jobApplicants.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">No applicants for this job yet</p>
                        </div>
                      ) : (
                        jobApplicants.slice(0, 3).map((application) => {
                          const applicant = application.applicant;
                          const applicantName = applicant?.full_name || applicant?.name || 'Unknown Applicant';
                          const initials = applicantName !== 'Unknown Applicant' 
                            ? applicantName.split(' ').map(n => n[0]).join('') 
                            : 'U';
                          
                          return (
                            <div key={application.id} className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-cyan/20 rounded-xl p-6 hover:border-theme-cyan/40 hover:shadow-theme-cyan/10 transition-all duration-300 group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="relative">
                                    <Avatar className="h-12 w-12 mr-4 border-2 border-theme-cyan/20">
                                      <AvatarImage src={applicant?.avatar_url} alt={applicantName} />
                                      <AvatarFallback className="bg-theme-cyan/20 text-theme-cyan font-semibold">{initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-theme-green rounded-full border-2 border-theme-black"></div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-theme-cyan text-lg">{applicantName}</h4>
                                    <p className="text-sm text-theme-cyan/70 mb-1">
                                      Applied on {new Date(application.created_at).toLocaleDateString()}
                                    </p>
                                    {applicant?.email && (
                                      <p className="text-xs text-theme-cyan/60">
                                        {applicant.email}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              
                                <div className="flex items-center gap-3">
                                  <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    application.status === 'Pending' ? 'bg-theme-cyan/20 text-theme-cyan border border-theme-cyan/30' : 
                                    application.status === 'Reviewed' ? 'bg-theme-purple/20 text-theme-purple border border-theme-purple/30' : 
                                    application.status === 'Accepted' ? 'bg-theme-green/20 text-theme-green border border-theme-green/30' :
                                    application.status === 'Rejected' ? 'bg-theme-orange/20 text-theme-orange border border-theme-orange/30' :
                                    'bg-theme-silver/20 text-theme-silver border border-theme-silver/30'
                                  }`}>
                                    {application.status}
                                  </Badge>
                                  <Button className="bg-gradient-to-r from-theme-cyan to-theme-cyan-light text-theme-black hover:from-theme-cyan-light hover:to-theme-cyan transition-all duration-300 shadow-lg hover:shadow-theme-cyan/20" size="sm">
                                    View Profile
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )
                    ) : (
                      // Show default candidates
                      candidates.slice(0, 3).map((candidate) => (
                        <div key={candidate.id} className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-purple/20 rounded-xl p-6 hover:border-theme-purple/40 hover:shadow-theme-purple/10 transition-all duration-300 group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="relative">
                                <Avatar className="h-12 w-12 mr-4 border-2 border-theme-purple/20">
                                  <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                  <AvatarFallback className="bg-theme-purple/20 text-theme-purple font-semibold">{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-theme-green rounded-full border-2 border-theme-black"></div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-theme-purple text-lg">{candidate.name}</h4>
                                <p className="text-sm text-theme-purple/70">Applied for {candidate.appliedFor}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${
                                candidate.status === 'New' ? 'bg-theme-cyan/20 text-theme-cyan border border-theme-cyan/30' : 
                                candidate.status === 'Reviewed' ? 'bg-theme-purple/20 text-theme-purple border border-theme-purple/30' : 
                                'bg-theme-orange/20 text-theme-orange border border-theme-orange/30'
                              }`}>
                                {candidate.status}
                              </Badge>
                              <Button className="bg-gradient-to-r from-theme-purple to-theme-purple-light text-theme-black hover:from-theme-purple-light hover:to-theme-purple transition-all duration-300 shadow-lg hover:shadow-theme-purple/20" size="sm">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="jobs" className="animate-fade-in space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input placeholder="Search jobs..." className="pl-10" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Active
                  </Button>
                  <Button variant="outline" size="sm">
                    Closed
                  </Button>
                  <Button size="sm">
                    Post New Job
                  </Button>
                </div>
              </div>
              
              <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Job Title</th>
                        <th className="text-left p-4 font-medium">Location</th>
                        <th className="text-left p-4 font-medium">Type</th>
                        <th className="text-left p-4 font-medium">Date Posted</th>
                        <th className="text-left p-4 font-medium">Applicants</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground mt-2">Loading jobs...</p>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="7" className="text-center py-8">
                            <p className="text-red-500">Error: {error}</p>
                          </td>
                        </tr>
                      ) : postedJobs.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-8">
                            <p className="text-muted-foreground">No jobs posted yet</p>
                          </td>
                        </tr>
                      ) : (
                        postedJobs.map((job) => (
                          <tr key={job.id} className="border-b hover:bg-secondary/10">
                            <td className="p-4">{job.title}</td>
                            <td className="p-4">{job.location}</td>
                            <td className="p-4">{job.job_type || 'Full-time'}</td>
                            <td className="p-4">
                              {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <Users size={16} className="mr-2 text-muted-foreground" />
                                {job.applications_count || 0}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {job.status || 'Active'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>View Applicants</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Job</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-500">
                                    {job.status === 'active' ? 'Close Job' : 'Delete Job'}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="candidates" className="animate-fade-in space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input placeholder="Search candidates..." className="pl-10" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    All Candidates
                  </Button>
                  <Button variant="outline" size="sm">
                    New
                  </Button>
                  <Button variant="outline" size="sm">
                    Shortlisted
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="glass rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div className="flex items-start lg:items-center mb-4 lg:mb-0">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={candidate.avatar} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-lg flex items-center">
                            {candidate.name}
                            <div className="ml-2 flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < Math.floor(candidate.rating) ? "text-yellow-400 fill-yellow-400" : i < candidate.rating ? "text-yellow-400 fill-yellow-400 opacity-50" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          </h4>
                          <p className="text-muted-foreground">{candidate.title}</p>
                          <div className="flex items-center mt-1 text-sm">
                            <Badge variant="outline" className="mr-2">
                              {candidate.experience} exp
                            </Badge>
                            <span>{candidate.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className={
                          candidate.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                          candidate.status === 'Reviewed' ? 'bg-purple-100 text-purple-800' : 
                          'bg-amber-100 text-amber-800'
                        }>
                          {candidate.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock size={14} className="mr-1" />
                          Applied {candidate.appliedDate}
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <div className="font-medium mb-1">Applied For</div>
                        <div className="text-muted-foreground">{candidate.appliedFor}</div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-1">Education</div>
                        <div className="text-muted-foreground">{candidate.education}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center mt-4">
                      <div className="text-sm text-muted-foreground">
                        <Eye size={14} className="inline mr-1" /> Resume viewed 2 days ago
                      </div>
                      
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <MessageCircle size={14} />
                          <span>Message</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Schedule Interview</span>
                        </Button>
                        <Button size="sm">View Profile</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
