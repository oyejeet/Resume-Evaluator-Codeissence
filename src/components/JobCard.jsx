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
  actionButton,
}) => {
  // Color mapping for job types
  const getTypeColor = (type) => {
    switch (type) {
      case "Full-time":
        return "bg-green-100 text-green-800 border-green-200";
      case "Part-time":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Contract":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Remote":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Hybrid":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Internship":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="group rounded-xl p-6 bg-gradient-to-br from-white to-blue-50 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
          <div className="flex flex-wrap items-center text-sm text-gray-600 gap-3 mb-3">
            <span className="flex items-center gap-1">
              <Building size={14} /> {company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {postedDate}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {type && (
              <Badge variant="outline" className={`font-semibold ${getTypeColor(type)}`}>
                {type}
              </Badge>
            )}
            {salary && salary !== 'Salary not specified' && salary !== '' ? (
              <Badge variant="outline" className="font-semibold bg-gray-100 border-gray-200">
                {typeof salary === 'number' || !isNaN(Number(salary)) ? `₹${salary}` : salary}
              </Badge>
            ) : (
              <Badge variant="outline" className="font-semibold bg-gray-100 border-gray-200">
                Salary not specified
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          {actionButton ? (
            actionButton
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 transform group-hover:scale-105"
              onClick={onViewJob}
            >
              View Job
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
    </div>
  );
};

export default JobCard;
