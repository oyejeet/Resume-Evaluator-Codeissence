import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const JobPostForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to post a job.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formattedDescription = `
        ${description}
        
        ## Responsibilities
        ${responsibilities}
        
        ## Requirements
        ${requirements}
      `;
      
      const { error } = await supabase
        .from("jobs")
        .insert([
          {
            title: jobTitle,
            company,
            location,
            job_type: jobType,
            salary_range: salary,
            description: formattedDescription,
            requirements,
            posted_by: user.id,
          },
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Job Posted",
        description: "Your job listing has been posted successfully.",
      });
      
      setJobTitle("");
      setCompany("");
      setLocation("");
      setJobType("");
      setSalary("");
      setDescription("");
      setRequirements("");
      setResponsibilities("");
      
      navigate("/recruiter-dashboard");
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Error posting job",
        description: error.message || "An error occurred while posting the job.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Job Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Software Engineer" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State, or Remote" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select required value={jobType} onValueChange={setJobType}>
              <SelectTrigger id="jobType">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary">Salary Range (Optional)</Label>
            <Input id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g., $60,000 - $80,000" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Job Description</h2>
        
        <div className="space-y-2">
          <Label htmlFor="description">Overview</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide a detailed description of the job..." rows={4} required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="responsibilities">Responsibilities</Label>
          <Textarea id="responsibilities" value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} placeholder="List the key responsibilities for this position..." rows={4} required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea id="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="List the skills, qualifications, and experience required..." rows={4} required />
        </div>
      </div>
      
      <div className="pt-4">
        <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
          {isLoading ? "Posting Job..." : "Post Job"}
        </Button>
      </div>
    </form>
  );
};

export default JobPostForm;