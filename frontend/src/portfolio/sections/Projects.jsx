import { useProjectsQuery } from "../../hooks/projectsQuery";
import { ErrorMessage } from "../reusables/ErrorResponses";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faLayerGroup,
  faStar,
  faArrowRight,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useMemo } from "react";

// Enterprise projects data
const enterpriseProjects = [
  {
    id: "enterprise-radbest",
    title: "Rad Best Trading - B2B Furniture Platform",
    role: "Full-Stack Developer",
    description:
      "Premium office furniture trading platform featuring product catalog, quote request system, service showcase, and customer testimonials. Built for B2B clients in Ethiopia with modern e-commerce capabilities and seamless user experience.",
    demo_link: "http://radbestgroup.com/",
    github_link: null,
    tools: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS",
      "RESTful API",
    ],
    image_path:
      "https://via.placeholder.com/800x600/10b981/ffffff?text=Rad+Best+Trading",
    category: "enterprise",
  },
  {
    id: "enterprise-belayab",
    title: "Belayab Group - Business Conglomerate Platform",
    role: "Full-Stack Developer",
    description:
      "Comprehensive corporate website for Belayab Business Group, a dynamic conglomerate operating across retail, food, automotive, manufacturing, agriculture, logistics, and hospitality. Features brand showcase, company information, and multi-brand navigation system.",
    demo_link: "https://belayabgroup.com/",
    github_link: null,
    tools: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Tailwind CSS",
      "API Routes",
    ],
    image_path:
      "https://via.placeholder.com/800x600/059669/ffffff?text=Belayab+Group",
    category: "enterprise",
  },
  {
    id: "enterprise-longtea",
    title: "Long Tea - Bubble Tea E-Commerce Platform",
    role: "Backend Developer",
    description:
      "Full-stack e-commerce platform for Long Tea, Ethiopia's exciting bubble tea destination. Features customizable tea ordering system, pre-order functionality, admin panel, and mobile app integration. Built with scalable architecture and modern backend technologies.",
    demo_link: "https://longtea.vercel.app/",
    github_link: null,
    tools: [
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "RESTful API",
      "JWT",
      "Payment Integration",
    ],
    image_path:
      "https://via.placeholder.com/800x600/14b8a6/ffffff?text=Long+Tea",
    category: "enterprise",
  },
];

const Projects = () => {
  const {
    data: projectsData,
    isLoading: isProjectLoading,
    error: projectsError,
  } = useProjectsQuery();

  // Tab state
  const [activeTab, setActiveTab] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Show 3 projects per page

  // Merge database projects with enterprise projects and add category if missing
  const allProjects = useMemo(() => {
    const dbProjects = (projectsData || []).map((project) => ({
      ...project,
      category: project.category || "other", // Default to "other" if no category
    }));
    return [...enterpriseProjects, ...dbProjects];
  }, [projectsData]);

  // Filter projects by active tab
  const filteredProjects = useMemo(() => {
    if (activeTab === "all") return allProjects;
    return allProjects.filter((project) => project.category === activeTab);
  }, [allProjects, activeTab]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to page 1 when tab or projects change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filteredProjects.length]);

  if (isProjectLoading) {
    return <ProjectsShimmer />;
  } else if (projectsError) {
    return <ProjectsShimmer />;
    // return <ErrorMessage status={projectsError.response?.status} />;
  }

  return (
    <section
      id="projects"
      className="relative px-4 sm:px-8 md:px-12 w-full py-20 sm:py-32 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full bg-green-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-24 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-600 dark:text-green-400 font-medium text-sm tracking-wide mb-4 shadow-sm"
          >
            <span className="flex items-center justify-center w-5 h-5 bg-green-600 dark:bg-green-500 rounded-full text-white text-xs mr-2">
              <FontAwesomeIcon icon={faLayerGroup} className="w-3 h-3" />
            </span>
            Our Creative Works
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 pb-2"
          >
            Featured Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore our showcase of innovative solutions that demonstrate
            technical excellence and creative problem-solving across various
            platforms.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center p-1.5 bg-cream-100 dark:bg-gray-800/70 backdrop-blur-sm rounded-full shadow-inner border border-smokey-200 dark:border-gray-700">
            {[
              { id: "all", label: "All Projects", icon: faLayerGroup },
              { id: "enterprise", label: "Enterprise", icon: faBuilding },
              { id: "other", label: "Other Projects", icon: faStar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                    : "text-smokey-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Project Highlight */}
        {currentProjects &&
          currentProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative mb-20 max-w-6xl mx-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-20 dark:opacity-30 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex flex-col lg:flex-row bg-cream-50 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
                <div className="lg:w-3/5 h-64 lg:h-80 lg:max-h-96 relative overflow-hidden">
                  <img
                    src={
                      project?.image_path
                        ? project.image_path.startsWith("/")
                          ? project.image_path
                          : `${
                              import.meta.env.VITE_SUPABASE_URL
                            }/storage/v1/object/public/portfolio_files/${
                              project?.image_path
                            }`
                        : "https://via.placeholder.com/800x600?text=Project+Image"
                    }
                    alt={project.title}
                    className="h-full w-full object-contain object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tools &&
                        (Array.isArray(project.tools)
                          ? project.tools
                          : JSON.parse(project.tools || "[]")
                        )
                          .slice(0, 5)
                          .map((tool, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white"
                            >
                              {tool}
                            </span>
                          ))}
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-yellow-300"
                    />
                    {index == 0 ? "Featured" : "Project"}
                  </div>
                </div>

                <div className="lg:w-2/5 p-6 lg:p-10 flex flex-col">
                  <div className="flex-grow">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                      {project.title}
                    </h3>

                    <p className="text-green-600 dark:text-green-400 font-medium mb-4">
                      {project.role}
                    </p>

                    <p className=" font-mono text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tools &&
                        (Array.isArray(project.tools)
                          ? project.tools
                          : JSON.parse(project.tools || "[]")
                        ).map((tool, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.3 + i * 0.1,
                            }}
                            className="text-xs px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium"
                          >
                            {tool}
                          </motion.span>
                        ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Status indicators */}
                    <div className="flex gap-2 flex-wrap">
                      {project.demo_link && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Currently Live
                        </span>
                      )}
                      {project.github_link && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                          <FontAwesomeIcon
                            icon={faGithub}
                            className="text-xs"
                          />
                          GitHub Available
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4">
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                          <FontAwesomeIcon icon={faGithub} />
                          <span>View Source</span>
                        </a>
                      )}
                      {project.demo_link && (
                        <a
                          href={project.demo_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                          <span>Live Demo</span>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-sm"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages} ({projectsData?.length || 0}{" "}
              projects)
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const ProjectsShimmer = () => {
  return (
    <section
      id="projects"
      className="px-4 sm:px-8 md:px-12 w-full py-20 sm:py-32 bg-gradient-to-b from-gray-50 via-gray-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Header Shimmer */}
      <div className="max-w-6xl mx-auto text-center mb-16 sm:mb-20">
        <div className="h-8 w-40 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        <div className="mt-4 h-12 w-72 sm:w-96 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="mt-6 h-4 w-full max-w-xl mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="mt-2 h-4 w-5/6 max-w-lg mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* z Project Shimmer */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl animate-pulse">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 h-64 lg:h-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
            <div className="lg:w-1/2 p-6 lg:p-10 space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"
                  />
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
