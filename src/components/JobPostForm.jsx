import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Mail, FileText, Clock, Twitter } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import xApiService from "@/services/xApiService";

const JobPostForm = ({ onJobPostSuccess }) => {
  const [formData, setFormData] = useState({
    title: 'Software Engineer',
    company: 'Acme Corp',
    location: 'Remote',
    description: 'Join our team to build amazing products!',
    salary: '100000',
    contactEmail: 'hr@acme.com',
    job_type: 'Full-time',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [postToX, setPostToX] = useState(true);
  const [xPostingStatus, setXPostingStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill(e);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setXPostingStatus(null);
    
    try {
      // Insert job post into Supabase
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            title: formData.title,
            company: formData.company,
            location: formData.location,
            description: formData.description,
            salary: formData.salary,
            contact_email: formData.contactEmail,
            skills: skills,
            job_type: formData.job_type,
          },
        ])
        .select();
      
      if (error) {
        throw error;
      }

      // Post to X (Twitter) if enabled
      if (postToX) {
        setXPostingStatus('posting');
        try {
          const xResult = await xApiService.postJobListing({
            title: formData.title,
            company: formData.company,
            location: formData.location,
            description: formData.description,
            salary: formData.salary,
            job_type: formData.job_type,
            skills: skills
          });

          if (xResult.success) {
            setXPostingStatus('success');
            console.log('Job posted to X successfully:', xResult.data);
          } else {
            setXPostingStatus('error');
            console.error('Failed to post to X:', xResult.error);
          }
        } catch (xError) {
          setXPostingStatus('error');
          console.error('X posting error:', xError);
        }
      }

      alert('Job Post Created Successfully!' + (postToX && xPostingStatus === 'success' ? ' Also posted to X!' : ''));
      
      // Reset form after successful submission
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: '',
        contactEmail: '',
        job_type: '',
      });
      setSkills([]);
      setSkillInput("");
      setXPostingStatus(null);
      
      if (onJobPostSuccess) {
        onJobPostSuccess();
      }
    } catch (error) {
      console.error('Error creating job post:', error);
      alert('Failed to create job post: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-gray-950 shadow-2xl rounded-2xl overflow-hidden border border-green-700">
      <div className="bg-green-600 text-white text-center py-6 px-4">
        <h2 className="text-3xl font-bold tracking-tight">Create Job Post</h2>
        <p className="mt-2 text-green-100">Share your job opportunity with top talent</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            required
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
          />
        </div>
  
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
            required
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
          />
        </div>
  
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Job Location"
            required
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
          />
        </div>
  
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            required
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 h-32 resize-none"
          />
        </div>
  
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary (optional)"
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
          />
        </div>
  
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Contact Email"
            required
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
          />
        </div>
  
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 appearance-none"
          >
            <option value="" disabled>Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
  
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-green-400 mb-1">Skills</label>
          <div className="flex gap-2">
            <input
              id="skills"
              type="text"
              value={skillInput}
              onChange={handleSkillInputChange}
              onKeyDown={handleSkillKeyDown}
              placeholder="Add a skill and press Enter"
              className="flex-1 pl-3 pr-3 py-2 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add
            </button>
          </div>
          {/* Skills chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill, idx) => (
              <span
                key={skill}
                className="flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium shadow-sm"
                style={{ borderRadius: '9999px' }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-green-600 hover:text-red-500 focus:outline-none"
                  aria-label={`Remove ${skill}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* X (Twitter) Posting Toggle */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Twitter className="h-5 w-5 text-blue-400" />
              <div>
                <label className="text-sm font-medium text-white">Post to X (Twitter)</label>
                <p className="text-xs text-gray-400">Automatically share this job on X</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={postToX}
                onChange={(e) => setPostToX(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          {/* X Posting Status */}
          {xPostingStatus && (
            <div className="mt-3 p-2 rounded-lg text-sm">
              {xPostingStatus === 'posting' && (
                <div className="flex items-center text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                  Posting to X...
                </div>
              )}
              {xPostingStatus === 'success' && (
                <div className="flex items-center text-green-400">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Successfully posted to X!
                </div>
              )}
              {xPostingStatus === 'error' && (
                <div className="flex items-center text-red-400">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Failed to post to X. Job still created successfully.
                </div>
              )}
            </div>
          )}
        </div>
  
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
            isSubmitting 
              ? 'bg-green-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Job Post'}
        </button>
      </form>
    </div>
  </div>
  
  );
};

export default JobPostForm;