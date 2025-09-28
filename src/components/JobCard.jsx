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
  // Color mapping for job types with complementary colors
  const getTypeColor = (type) => {
    switch (type) {
      case "Full-time":
        return "bg-theme-green/20 text-theme-green border-theme-green/40";
      case "Part-time":
        return "bg-theme-cyan/20 text-theme-cyan border-theme-cyan/40";
      case "Contract":
        return "bg-theme-purple/20 text-theme-purple border-theme-purple/40";
      case "Remote":
        return "bg-theme-orange/20 text-theme-orange border-theme-orange/40";
      case "Hybrid":
        return "bg-theme-green/15 text-theme-green-light border-theme-green/35";
      case "Internship":
        return "bg-theme-cyan/15 text-theme-cyan-light border-theme-cyan/35";
      default:
        return "bg-theme-dark text-theme-green border-theme-green/20";
    }
  };

  return (
    <div className="group rounded-xl p-6 bg-gradient-to-br from-theme-dark via-theme-black to-theme-darker shadow-lg border border-theme-green/20 hover:shadow-xl hover:border-theme-green/40 hover:shadow-theme-green/10 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-theme-green mb-1">{title}</h3>
          <div className="flex flex-wrap items-center text-sm text-theme-green/80 gap-3 mb-3">
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
              <Badge variant="outline" className="font-semibold bg-theme-green/10 text-theme-green border-theme-green/30">
                {typeof salary === 'number' || !isNaN(Number(salary)) ? `₹${salary}` : salary}
              </Badge>
            ) : (
              <Badge variant="outline" className="font-semibold bg-theme-green/10 text-theme-green border-theme-green/30">
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
              className="bg-theme-green text-theme-black hover:bg-theme-green-light transition-all duration-300 transform group-hover:scale-105 border-theme-green"
              onClick={onViewJob}
            >
              View Job
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-theme-green/70 line-clamp-2">{description}</p>
    </div>
  );
};

export default JobCard;
