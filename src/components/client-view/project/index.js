"use client";

import { useRef, useState } from "react";
import AnimationWrapper from "../animation-wrapper";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";

export default function ClientProjectView({ data }) {
  const containerRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (index) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  return (
    <div
      className="max-w-screen-xl mx-auto mt-24 mb-6 px-6 sm:mt-14 sm:mb-14 sm:px-8 lg:px-16"
      id="project"
    >
      <AnimationWrapper className="py-6 sm:py-16">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-3xl font-medium leading-[70px] lg:text-4xl xl:text-5xl">
            {"My Projects".split(" ").map((item, index) => (
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
          {data && data.length ? (
            data.map((item, index) => (
              <div key={item._id || index} className="bg-gray-50 p-4 rounded-lg shadow-md">
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  {item.image && item.image.trim() !== "" && !imageErrors[index] ? (
                    <Image
                      src={item.image}
                      alt={item.name || "Project image"}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
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
                  <span className="inline-block bg-orange-200 text-orange-800 text-sm font-semibold px-2 py-1 rounded-full">
                    #{item.category || "Uncategorized"}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-black">{item.name}</h3>
                  <p className="mt-2 text-gray-600 text-sm">{item.description || "No description available"}</p>
                  <a href="#" className="mt-4 inline-block text-orange-500 hover:underline">Read More <span>→</span></a>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-16 text-center">
              <p className="text-xl text-gray-600">No projects available yet.</p>
            </div>
          )}
        </div>
      </AnimationWrapper>
    </div>
  );
}