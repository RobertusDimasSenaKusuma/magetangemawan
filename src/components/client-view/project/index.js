"use client";

import { useRef, useState } from "react";
import AnimationWrapper from "../animation-wrapper";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";

export default function ClientProjectView({ data }) {
  const containerRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  const [imageErrors, setImageErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6; // Number of projects per page

  const handleImageError = (index) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = data?.slice(indexOfFirstProject, indexOfLastProject) || [];
  const totalPages = Math.ceil((data?.length || 0) / projectsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: containerRef.current.offsetTop - 100, behavior: "smooth" });
  };

  return (
    <div
      className="max-w-screen-xl mx-auto mt-24 mb-6 px-6 sm:mt-14 sm:mb-14 sm:px-8 lg:px-16"
      id="project"
      ref={containerRef}
    >
      <AnimationWrapper className="py-6 sm:py-16">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-3xl font-medium leading-[70px] lg:text-4xl xl:text-5xl">
            {"Berita & Artikel".split(" ").map((item, index) => (
              <span
                key={index}
                className={index === 1 ? "text-green-main" : "text-black"}
              >
                {item}{" "}
              </span>
            ))}
          </h1>
        </div>
      </AnimationWrapper>

      <AnimationWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects && currentProjects.length ? (
            currentProjects.map((item, index) => (
              <div key={item._id || index} className="bg-gray-50 p-4 rounded-lg shadow-md">
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  {item.image && item.image.trim() !== "" && !imageErrors[index] ? (
                    <Image
                      src={item.image}
                      alt={item.name || "Project image"}
                      fill
                      className="object-contain transition-transform duration-300 hover:scale-105"
                      onError={() => handleImageError(index)}
                      priority={index < 2}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200">
                      <div className="text-center text-gray-500">
                        <div className="mb-2 text-6xl">🖼️</div>
                        <p className="text-lg">Image not available</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <span className="inline-block bg-orange-500 text-white-300 text-sm font-semibold px-2 py-1 rounded-full">
                    #{item.category || "Uncategorized"}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-black">{item.name}</h3>
                  <p className="mt-2 text-gray-600 text-sm">{item.description || "No description available"}</p>
                  <a href="#" className="mt-4 inline-block text-green1-500 hover:underline">Read More <span>→</span></a>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-16 text-center">
              <p className="text-xl text-gray-600">No projects available yet.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-300"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page ? "bg-green1-500 text-white-500" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </AnimationWrapper>
    </div>
  );
}