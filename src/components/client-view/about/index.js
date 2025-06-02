"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

// Mock AnimationWrapper component
function AnimationWrapper({ children, className }) {
  return (
    <motion.div
      className={className}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.8 }}
    >
      {children}
    </motion.div>
  );
}

function variants() {
  return {
    offscreen: {
      y: 150,
      opacity: 0,
    },
    onscreen: ({ duration = 2 } = {}) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration,
      },
    }),
  };
}

const skillItemVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function ClientAboutView({ data = {} }) {
  console.log(data, "aboutdata");

  const setVariants = useMemo(() => variants(), []);

  const aboutDataInfo = [
    {
      label: "Client",
      value: data?.noofclients || "50",
    },
    {
      label: "Projects",
      value: data?.noofprojects || "100",
    },
    {
      label: "Experience",
      value: data?.yearofexperience || "5",
    },
  ];

  // Statistics data for the top section
  const statisticsData = [
    { number: "3000+", label: "Warga Desa", icon: "👥" },
    { number: "25", label: "Program KKN", icon: "📚" },
    { number: "15", label: "UMKM Aktif", icon: "🏪" },
    { number: "98%", label: "Kepuasan", icon: "⭐" }
  ];

  const headingText = "Why Hire Me For Your Next Project ?";

  return (
    <div className="max-w-screen-xl mt-24 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto" id="about">
      
      {/* Statistics Section - Now properly implemented */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 pt-8"
      >
        {statisticsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
              {stat.number}
            </div>
            <div className="text-gray-600 font-medium text-sm">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main About Section */}
      <div className="w-full flex flex-col">
        {/* About Info Cards */}
        <AnimationWrapper className="rounded-lg w-full grid-flow-row grid grid-cols-1 sm:grid-cols-3 py-9 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-green-500 bg-white-500 z-10 mb-8">
          {aboutDataInfo.map((infoItem, index) => (
            <motion.div
              className={`flex items-center justify-start
                ${
                  index === 0
                    ? "sm:justify-start"
                    : index === 1
                    ? "sm:justify-center"
                    : "sm:justify-end"
                } py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0
                `}
              key={index}
              custom={{ duration: 2 + index }}
              variants={setVariants}
            >
              <div className="flex m-0 w-40 sm:w-auto">
                <div className="flex flex-col">
                  <p className="text-[50px] text-green-500 font-bold">
                    {infoItem.value}+
                  </p>
                  <p className="text-[25px] font-bold text-black">
                    {infoItem.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimationWrapper>

        {/* Heading Section */}
        <AnimationWrapper className="pt-6">
          <div className="flex flex-col justify-center items-center row-start-2 sm:row-start-1">
            <h1 className="leading-[70px] mb-4 text-3xl lg:text-4xl xl:text-5xl font-medium text-center">
              {headingText.split(" ").map((item, index) => (
                <span
                  key={index}
                  className={`${index === 6 ? "text-green-500" : "text-black"}`}
                >
                  {item}{" "}
                </span>
              ))}
            </h1>
            <p className="text-black mt-4 mb-8 font-bold text-center max-w-2xl">
              {data?.aboutme || "I am a passionate developer with years of experience creating amazing digital solutions. I specialize in modern web technologies and love turning ideas into reality."}
            </p>
          </div>
        </AnimationWrapper>

        {/* Content Grid */}
        <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Image Section */}
          <AnimationWrapper className="flex w-full">
            <motion.div variants={setVariants} className="h-full w-full p-4">
              <div className="w-full h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">👨‍💻</div>
                  <p className="text-xl font-semibold">About Me Image</p>
                </div>
              </div>
            </motion.div>
          </AnimationWrapper>

          {/* Skills Section */}
          <AnimationWrapper className="flex items-center w-full p-4">
            <motion.div
              variants={setVariants}
              className="grid gap-4 grid-cols-2 lg:grid-cols-3 h-full w-full"
            >
              {(data?.skills || "React,JavaScript,Node.js,Python,MongoDB,PostgreSQL").split(",").map((skill, index) => (
                <motion.div
                  key={index}
                  className="w-full flex justify-center items-center"
                  variants={skillItemVariant}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <button className="whitespace-nowrap text-ellipsis overflow-hidden py-3 px-4 w-full border-2 border-green-500 bg-white text-black font-semibold rounded-lg text-sm lg:text-base tracking-wide hover:shadow-lg hover:shadow-green-500/25 transition-all outline-none hover:scale-105">
                    {skill.trim()}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </AnimationWrapper>
        </div>
      </div>
    </div>
  );
}