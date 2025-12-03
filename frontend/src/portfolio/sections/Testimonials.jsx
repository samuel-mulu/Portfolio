/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas);

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Tariku Brahne",
      position: "Operational",
      company: "Blih Company",
      testimonial:
        "Working with this developer has been an exceptional experience. Their attention to detail and commitment to delivering high-quality solutions is remarkable. They consistently exceed expectations and bring innovative ideas to every project.",
      rating: 5,
    },
    {
      id: 2,
      name: "Amdebrhan Asmamaw",
      position: "Senior Fullstack Developer",
      company: "amdebrhan.com",
      testimonial:
        "As a fellow developer, I can confidently say this developer is one of the most talented professionals I've worked with. Their technical expertise, problem-solving skills, and dedication to excellence make them an invaluable asset to any team.",
      rating: 5,
    },
    {
      id: 3,
      name: "Fitsum Abraha",
      position: "CEO",
      company: "Perfect Technology",
      testimonial:
        "This developer has been instrumental in driving our technology initiatives forward. Their ability to understand complex requirements and translate them into elegant solutions is outstanding. I highly recommend their services.",
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
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
              <FontAwesomeIcon icon="quote-left" className="w-3 h-3" />
            </span>
            Client Testimonials
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 pb-2"
          >
            What Clients Say
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-smokey-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Hear from industry leaders and colleagues about their experience
            working with me.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-cream-50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-smokey-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <FontAwesomeIcon
                  icon="quote-left"
                  className="text-3xl text-green-500 dark:text-green-400 opacity-50"
                />
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon="star"
                    className="text-yellow-400 text-sm"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-smokey-700 dark:text-gray-300 mb-6 leading-relaxed text-base">
                "{testimonial.testimonial}"
              </p>

              {/* Author Info */}
              <div className="border-t border-smokey-200 dark:border-gray-700 pt-4">
                <h3 className="font-bold text-lg text-smokey-900 dark:text-white mb-1">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {testimonial.position}
                </p>
                <p className="text-sm text-smokey-600 dark:text-gray-400">
                  {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
