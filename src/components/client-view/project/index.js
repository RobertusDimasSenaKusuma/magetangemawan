"use client";

import { useRef, useState } from "react";
import AnimationWrapper from "../animation-wrapper";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ClientProjectView({ data }) {
  const containerRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  const [imageErrors, setImageErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
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

  // Function to handle YouTube video play
  const handlePlayVideo = (youtubeUrl) => {
    if (youtubeUrl) {
      // Extract video ID from YouTube URL
      const videoId = extractYouTubeVideoId(youtubeUrl);
      if (videoId) {
        setCurrentVideo(videoId);
        setModalOpen(true);
      }
    }
  };

  // Function to extract YouTube video ID from URL
  const extractYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentVideo('');
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
                <div className="mt-4 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block bg-green1-500 text-white-300 text-sm font-semibold px-2 py-1 rounded-full">
                      {item.github || "Uncategorized"}
                    </span>
                    {item.youtube && item.youtube.trim() !== "" && (
                      <button
                        onClick={() => handlePlayVideo(item.youtube)}
                        className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white-500 text-xs px-3 py-1 rounded-full transition-colors font-medium"
                        title="Play Video"
                      >
                        <svg 
                          className="w-3 h-3" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        <span>Play Dokumentasi</span>
                      </button>
                    )}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-black">{item.name}</h3>
                  <p className="mt-2 mb-4 text-gray-600 text-justify">
                  {item.technologies
                    ? item.technologies.split('.').slice(0, 1).join('.') + (item.technologies.split('.').length > 2 ? '.' : '')
                    : "No description available"}
                </p>
                  <Link
                    href={`/berita?id=${item._id || item.id}`}
                    className="bg-orange-500 hover:bg-orange-500 text-white-500 text-xs px-6 py-2 rounded-full transition-colors font-medium"
                  >
                    Baca Selengkapnya <span>→</span>
                  </Link>
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

      {/* YouTube Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Video Container */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}