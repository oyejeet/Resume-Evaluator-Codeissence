import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ProfileForm = ({ onSubmit }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && currentSkill.trim() !== "") {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        title,
        bio: summary,
        location,
        phone,
        skills: skills.join(','),
        education,
        experience,
      };
      
      if (onSubmit) {
        onSubmit(profileData);
      } else {
        toast({
          title: "Profile Created",
          description: "Your profile has been created successfully.",
        });
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" disabled required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="New York, NY" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Professional Information</h2>
        
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior Software Engineer" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Briefly describe your professional background and career goals..." rows={4} required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Input id="skills" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} onKeyDown={handleAddSkill} placeholder="Add skills and press Enter" />
          
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1 pl-3 pr-2 py-1.5">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-foreground/60 hover:text-foreground/80">
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="education">Education</Label>
          <Textarea id="education" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="List your educational background..." rows={3} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience">Work Experience</Label>
          <Textarea id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="List your relevant work experience..." rows={4} />
        </div>
      </div>
      
      <div className="pt-4">
        <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>{isLoading ? "Creating Profile..." : "Create Profile"}</Button>
      </div>
    </form>
  );
};

export default ProfileForm;