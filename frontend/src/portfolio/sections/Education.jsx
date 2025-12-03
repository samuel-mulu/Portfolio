import React, { useEffect, useState } from "react";
import {
  FaGraduationCap,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUniversity,
  FaDownload,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useEducationQuery } from "../../hooks/educationQuery";
import { supabase } from "../../config/supabaseConfig";

export default function Education() {
  const [education, setEducation] = useState([]);
  const { data: educationData, isLoading, error } = useEducationQuery();

  useEffect(() => {
    if (educationData) {
      setEducation(educationData);
    }
  }, [educationData]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center text-red-500">
        <p>Error loading education data</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
        {education.map((edu, index) => (
          <EducationCard key={index} edu={edu} index={index} />
        ))}
      </div>
    </div>
  );
}

function EducationCard({ index, edu }) {
  const {
    degree,
    field,
    institution,
    start_date,
    end_date,
    location,
    description,
    pdf_path,
  } = edu;

  const handleDownloadTranscript = async () => {
    if (!pdf_path) {
      alert("Transcript PDF not available");
      return;
    }

    try {
      // Check if path is from public folder (starts with /)
      if (pdf_path.startsWith("/")) {
        // Public folder path - fetch and download
        const response = await fetch(pdf_path);
        if (!response.ok) {
          throw new Error(`Failed to fetch transcript: ${response.statusText}`);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = pdf_path.split("/").pop() || "transcript.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Supabase storage path - download from storage
        const response = await supabase.storage
          .from("portfolio_files")
          .download(pdf_path);

        if (!response.data) throw new Error("Failed to download transcript");

        const url = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transcript.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading transcript:", error);
      alert(`Failed to download transcript: ${error.message}`);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const duration = end_date
    ? `${formatDate(start_date)} - ${formatDate(end_date)}`
    : `${formatDate(start_date)} - Present`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="border border-gray-300 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
          <div className="absolute inset-0 bg-white opacity-10 rotate-45"></div>
        </div>
        <h2 className="font-bold text-2xl text-white mb-2">
          {degree} {field && `in ${field}`}
        </h2>
        <div className="flex flex-col space-y-2 text-white/90">
          <div className="flex items-center">
            <FaUniversity className="mr-3" />
            <span className="font-medium">{institution}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-3" />
            <span>{duration}</span>
          </div>
          {location && (
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-3" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-green-600 dark:text-green-400">
            <FaGraduationCap className="mr-2" />
            <span className="font-semibold">Degree Completed</span>
          </div>
          {pdf_path && (
            <button
              onClick={handleDownloadTranscript}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaDownload className="text-sm" />
              <span>Download Transcript</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
