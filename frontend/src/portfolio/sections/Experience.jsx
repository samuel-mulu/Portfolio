// Experience.js
import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaTasks,
  FaChevronDown,
  FaChevronUp,
  FaTrophy,
  FaCode,
  FaExternalLinkAlt,
  FaGlobe,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useExperiencesQuery } from "../../hooks/experienceQuery";

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const { data: experienceData, isLoading, error } = useExperiencesQuery();

  useEffect(() => {
    if (experienceData) {
      setExperience(experienceData);
    }
  }, [experienceData]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center text-red-500">
        <p>Error loading experience data</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {experience.map((job, index) => (
        <JobCard key={index} job={job} index={index} />
      ))}
    </div>
  );
}

function JobCard({ index, job }) {
  const {
    title,
    role,
    company,
    start_date,
    end_date,
    description,
    responsibilities,
    technologies,
    achievements,
    company_url,
  } = job;

  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (date) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const jobTitle = title || role || "Developer";
  const duration = end_date
    ? `${formatDate(start_date)} - ${formatDate(end_date)}`
    : `${formatDate(start_date)} - Present`;

  let parsedTechnologies = [];
  if (technologies) {
    try {
      parsedTechnologies =
        typeof technologies === "string"
          ? JSON.parse(technologies)
          : technologies;
    } catch (e) {
      parsedTechnologies = [];
    }
  }

  const parsedResponsibilities = responsibilities
    ? typeof responsibilities === "string"
      ? responsibilities.split(",")
      : responsibilities
    : [];
  const parsedAchievements = achievements
    ? typeof achievements === "string"
      ? achievements.split(",")
      : achievements
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="border border-gray-300 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
          <div className="absolute inset-0 bg-white opacity-10 rotate-45"></div>
        </div>
        <h2 className="font-bold text-2xl text-white mb-3">{jobTitle}</h2>
        <div className="flex flex-col space-y-2 text-white/90">
          <div className="flex items-center">
            <FaBriefcase className="mr-3" />
            {company_url ? (
              <a
                href={company_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                {company}
              </a>
            ) : (
              <span className="font-medium">{company}</span>
            )}
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-3" />
            <span>{duration}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        )}

        <div className="space-y-4">
          {parsedTechnologies.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center text-gray-800 dark:text-gray-200">
                <FaCode className="mr-2" /> Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsedTechnologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {parsedResponsibilities.length > 0 && (
            <ExpandableSection
              title="Responsibilities"
              items={parsedResponsibilities}
              icon={<FaTasks />}
              showDetails={showDetails}
            />
          )}

          {parsedAchievements.length > 0 && (
            <ExpandableSection
              title="Key Achievements"
              items={parsedAchievements}
              icon={<FaTrophy />}
              showDetails={showDetails}
            />
          )}
        </div>

        <div className="flex gap-3">
          {company_url && (
            <a
              href={company_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium flex items-center justify-center hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaGlobe className="mr-2" />
              Visit Website
              <FaExternalLinkAlt className="ml-2 text-xs" />
            </a>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ${
              company_url ? "flex-1" : "w-full"
            }`}
          >
            {showDetails ? (
              <>
                Show Less <FaChevronUp className="ml-2" />
              </>
            ) : (
              <>
                Show More <FaChevronDown className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ExpandableSection({ title, items, icon, showDetails }) {
  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg flex items-center text-gray-800 dark:text-gray-200">
        {React.cloneElement(icon, { className: "mr-2" })} {title}
      </h3>
      <ul className="space-y-2">
        <li className="flex items-start text-gray-600 dark:text-gray-400">
          <span className="mr-2 mt-1">•</span>
          <span>{items[0]}</span>
        </li>
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {items.slice(1).map((item, i) => (
                <li
                  key={i}
                  className="flex items-start text-gray-600 dark:text-gray-400"
                >
                  <span className="mr-2 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}
