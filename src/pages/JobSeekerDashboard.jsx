import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, FileText, Clock, BookmarkPlus } from "lucide-react";
import { InterviewCalendar } from "@/components/InterviewCalendar";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import JobCard from "@/components/JobCard";
import JobPlacard from "@/components/JobPlacard";

const JobSeekerDashboard = () => {
  const { isAuthenticated, isLoading, user, isRecruiter } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dashboardTab, setDashboardTab] = useState("applications");
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isPlacardOpen, setIsPlacardOpen] = useState(false);

  const handlePlacardApply = async () => {
    if (!selectedJob) return;

    // The placard's own apply function handles inserting into 'applications'.
    // This handler just needs to remove it from 'saved_jobs'.
    const { error: deleteError } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', user.id)
      .eq('job_id', selectedJob.id);

    if (deleteError) {
      alert(`Error removing from saved jobs: ${deleteError.message}`);
    } else {
      // Manually update states for instant feedback
      const appliedJob = savedJobs.find(j => j.id === selectedJob.id);
      if (appliedJob) {
        setApplications(currentApplications => [...currentApplications, { job: appliedJob, ...selectedJob }]);
        setSavedJobs(currentSavedJobs => currentSavedJobs.filter(j => j.id !== selectedJob.id));
      }
    }

    setIsPlacardOpen(false); // Close placard on successful apply
  };

  // Redirect if not authenticated or if user is a recruiter
  if (!isLoading && (!isAuthenticated || isRecruiter)) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoadingData(true);
      try {
        // Fetch saved jobs
        const { data: savedJobsData, error: savedJobsError } = await supabase
          .from('saved_jobs')
          .select('*, job:jobs(*)')
          .eq('user_id', user.id);

        if (savedJobsError) throw savedJobsError;

        // Fetch applications for the user
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select('*')
          .eq('applicant_id', user.id);

        if (applicationsError) {
          console.error('Error fetching applications:', applicationsError);
        } else {
          console.log('Applications:', applicationsData);
        }

        const savedJobsList = savedJobsData.map(item => item.job);
        setSavedJobs(savedJobsList);
        setApplications(applicationsData);

        const jobIds = applicationsData.map(app => app.job_id);

        let jobs = [];
        if (jobIds.length > 0) {
          const { data: jobsData, error: jobsError } = await supabase
            .from('jobs')
            .select('*')
            .in('id', jobIds);
          if (jobsError) {
            console.error('Error fetching jobs:', jobsError);
          } else {
            console.log("Fetched jobs for applications:", jobsData);
            jobs = jobsData;
          }
        }

        const applicationsWithJobs = applicationsData.map(app => ({
          ...app,
          job: jobs.find(job => job.id === app.job_id)
        }));

        setApplications(applicationsWithJobs);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();

    // Set up realtime subscription for saved jobs and applications
    const savedJobsChannel = supabase
      .channel('saved_jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_jobs',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch saved jobs when changes occur
          fetchDashboardData();
        }
      )
      .subscribe();

    const applicationsChannel = supabase
      .channel('applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `applicant_id=eq.${user.id}`,
        },
        () => {
          // Refetch applications when changes occur
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(savedJobsChannel);
      supabase.removeChannel(applicationsChannel);
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchJobsForApplications = async () => {
      setLoading(true);
      // 1. Fetch applications for the user
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('applicant_id', user.id);

      if (appError) {
        console.error('Error fetching applications:', appError);
        setJobs([]);
        setLoading(false);
        return;
      }

      // 2. Get all job_ids from applications
      const jobIds = applications.map(app => app.job_id);

      if (jobIds.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      // 3. Fetch all jobs with those IDs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .in('id', jobIds);

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        setJobs([]);
      } else {
        console.log("Fetched jobs for applications:", jobsData);
        setJobs(jobsData);
      }
      setLoading(false);
    };

    fetchJobsForApplications();
  }, [user]);

  useEffect(() => {
    async function testFetch() {
      const { data, error } = await supabase
        .from('applications')
        .select('*');
      console.log('Test fetch applications:', JSON.stringify(data, null, 2));
    }
    testFetch();
  }, []);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto rounded-full bg-blue-200"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  console.log('Current user ID:', user.id);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Job Seeker Dashboard</h1>
            <p className="text-slate-600">Manage your job search and applications</p>
          </div>
          
          <Tabs defaultValue="applications" className="space-y-8" value={dashboardTab} onValueChange={setDashboardTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
              <TabsTrigger value="applications" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm">
                <Briefcase className="h-4 w-4" />
                <span>Applications</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm">
                <BookmarkPlus className="h-4 w-4" />
                <span>Saved Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="interviews" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm">
                <Calendar className="h-4 w-4" />
                <span>Interviews</span>
              </TabsTrigger>
              <TabsTrigger value="resume" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm">
                <FileText className="h-4 w-4" />
                <span>Resume</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications" className="space-y-4">
              <Card className="border-blue-200 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-b border-blue-200">
                  <CardTitle className="text-white">Your Applications</CardTitle>
                  <CardDescription className="text-blue-100">Track the status of your job applications</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-md animate-pulse">
                          <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                          <div className="h-4 bg-muted rounded w-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="text-center py-10">
                      <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
                      <p className="mt-1 text-muted-foreground">Start applying to jobs to see them here.</p>
                      <Button className="mt-4" size="sm" onClick={() => navigate('/jobs')}>Browse Jobs</Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {applications.map(app => (
                        app.job ? (
                          <JobCard
                            key={app.id}
                            id={app.job.id}
                            title={app.job.title}
                            company={app.job.company}
                            location={app.job.location}
                            type={app.job.job_type || app.job.type}
                            postedDate={new Date(app.job.created_at).toLocaleDateString()}
                            description={app.job.description}
                            salary={app.job.salary}
                            isNew={false}
                            actionButton={
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                              >
                                View Status
                              </Button>
                            }
                          />
                        ) : null
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="saved" className="space-y-4">
              <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-b border-green-200">
                  <CardTitle className="text-white">Saved Jobs</CardTitle>
                  <CardDescription className="text-green-100">Jobs you've bookmarked for later</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingData ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="p-4 border border-green-200 rounded-lg animate-pulse bg-green-50/50">
                          <div className="h-5 bg-green-200 rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-green-200 rounded w-1/4 mb-4"></div>
                          <div className="h-4 bg-green-200 rounded w-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : savedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {savedJobs.map((job) =>
                        job ? (
                          <JobCard
                            key={job.id}
                            id={job.id}
                            title={job.title}
                            company={job.company}
                            location={job.location}
                            type={job.job_type || job.type}
                            postedDate={new Date(job.created_at).toLocaleDateString()}
                            description={job.description}
                            salary={job.salary}
                            isNew={false}
                            onViewJob={() => {
                              setSelectedJob(job);
                              setIsPlacardOpen(true);
                            }}
                          />
                        ) : null
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4">
                        <BookmarkPlus className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-slate-700">No saved jobs</h3>
                      <p className="mt-1 text-slate-500">Save jobs you're interested in to apply later.</p>
                      <Button className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" size="sm">Browse Jobs</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="interviews" className="space-y-4">
              <div className="rounded-lg border border-purple-200 bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-b border-purple-200 p-6">
                  <h2 className="text-xl font-semibold text-white">Interview Schedule</h2>
                  <p className="text-purple-100">Manage your upcoming interviews</p>
                </div>
                <div className="p-6">
                  <InterviewCalendar />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resume" className="space-y-4">
              <div className="rounded-lg border border-orange-200 bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white border-b border-orange-200 p-6">
                  <h2 className="text-xl font-semibold text-white">Resume Builder</h2>
                  <p className="text-orange-100">Create and manage your professional resume</p>
                </div>
                <div className="p-6">
                  <ResumeBuilder onShowResumeTab={() => setDashboardTab("resume")} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Button 
              onClick={async () => {
                const { data, error } = await supabase
                  .from('applications')
                  .select('*');
                console.log('Test fetch applications:', JSON.stringify(data, null, 2));
              }}
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800"
            >
              Test Fetch Applications
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />

      {isPlacardOpen && selectedJob && (
        <JobPlacard
          job={selectedJob}
          isOpen={isPlacardOpen}
          onClose={() => setIsPlacardOpen(false)}
          onApplied={handlePlacardApply}
        />
      )}
    </div>
  );
};

export default JobSeekerDashboard;