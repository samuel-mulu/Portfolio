import { Toaster } from "sonner";
import Header from "./sections/Header";
import Home from "./sections/Home";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import { useEffect, useState } from "react";
import { useLandingContent } from "../hooks/landingContentQuery";

const Portfolio = () => {
  const { data: contentData } = useLandingContent();

  return (
    <div className="h-full scroll-smooth bg-white dark:bg-black transition-all duration-700 ">
      <Toaster position="top-center" invert richColors />

      <Header />
      {/* <main className="flex flex-col justify-center items-center w-full transition-colors duration-300"> */}
      <Home />
      <About />
      <Skills />
      <EducationSection />
      <ExperienceSection />
      <Projects />
      <Contact />
      {/* </main> */}
      <Footer referenceIcons={contentData?.reference_icons} />
    </div>
  );
};

// Experience Section Wrapper
const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className="relative px-4 sm:px-8 md:px-12 w-full py-20 sm:py-32 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 pb-2">
            Work Experience
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            My professional journey and contributions to innovative companies.
          </p>
        </div>
        <Experience />
      </div>
    </section>
  );
};

// Education Section Wrapper
const EducationSection = () => {
  return (
    <section
      id="education"
      className="relative px-4 sm:px-8 md:px-12 w-full py-20 sm:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 pb-2">
            Education
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            My academic background and educational achievements.
          </p>
        </div>
        <Education />
      </div>
    </section>
  );
};

export default Portfolio;
