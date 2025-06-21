import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Building } from "lucide-react";
import { Link } from "react-router-dom";

const JobCard = ({
  id,
  title,
  company,
  location,
  type,
  postedDate,
  description,
  salary,
  isNew = false,
  onViewJob,
}) => {
  // Get color based on job type
  const getTypeColor = (type) => {
    switch (type) {
      case "Full-time":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Part-time":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Contract":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Remote":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
      case "Internship":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="group glass rounded-xl p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold mr-3">{title}</h3>
            {isNew && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                New
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-3 mb-2">
            <div className="flex items-center">
              <Building size={14} className="mr-1" />
              <span>{company}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={14} className="mr-1" />
              <span>{location}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{postedDate}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {type && <Badge className={`font-normal ${getTypeColor(type)}`}>{type}</Badge>}
            {salary && salary !== 'Salary not specified' && salary !== ''
              ? <Badge variant="outline" className="font-normal">{typeof salary === 'number' || !isNaN(Number(salary)) ? `₹${salary}` : salary}</Badge>
              : <Badge variant="outline" className="font-normal">Salary not specified</Badge>}
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="transition-all duration-300 group-hover:bg-primary group-hover:text-white" onClick={onViewJob}>
            View Job
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
    </div>
  );
};

export default JobCard;
