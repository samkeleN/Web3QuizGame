'use client'

import React, { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const projects = [
  {
    id: "techbridge",
    name: "TechBridge",
    description: "Connecting African youths to technology opportunities",
    link: "giveth.io/project/techbridge"
  },
  {
    id: "healthaccess",
    name: "HealthAccess",
    description: "Connecting African youths to technology opportunities",
    link: "giveth.io/project/techbridge"
  },
  {
    id: "greenuture",
    name: "GreenFuture",
    description: "Connecting African youths to technology opportunities",
    link: "giveth.io/project/techbridge"
  },
  {
    id: "greenfutur",
    name: "GreenFuture",
    description: "Connecting African youths to technology opportunities",
    link: "giveth.io/project/techbridge"
  },
  {
    id: "eenfure",
    name: "GreenFuture",
    description: "Connecting African youths to technology opportunities",
    link: "giveth.io/project/techbridge"
  },
  {
    id: "grenfure",
    name: "GreenFuture",
    description: "Connecting African youths to technology opportunities",
    link: "giveth.io/project/techbridge"
  },
  {
    id: "grnfure",
    name: "GreenFuture",
    description: "Connecting African youths to technology opportunities",
    link: "giveth.io/project/techbridge"
  },
  {
    id: "reenfure",
    name: "GreenFuture",
    description: "Connecting African youths to technology opportunities",
    link: "giveth.io/project/techbridge"
  }

];

export default function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>("techbridge");

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start mt-4 h-screen">

        {/* Back Button */}
        <div className="w-full max-w-sm flex items-start">
          <button className="text-yellow-400 hover:text-yellow-300 text-2xl">
            <ArrowLeft />
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-[#FFF8C9] text-2xl -mt-4 sm:text-3xl font-bold mb-4 leading-snug">
          Choose a <br />
          project
        </h1>

        {/* Project List Container with Fixed Height */}
        <div className="w-full max-w-sm h-[600px] relative">

          <div className="overflow-y-auto py-2 max-h-[calc(100vh-400px)] space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {projects.map((project) => {
              const isSelected = selectedId === project.id;
              return (
                <div key={project.id} className="rounded-2xl overflow-hidden shadow-sm hover:scale-[1.01] transition-all ">
                  <button
                    onClick={() => setSelectedId(project.id)}
                    className={`w-full text-left px-4 py-4 text-lg font-semibold flex justify-between items-center
            ${isSelected ? "bg-teal-600 text-[#FFF8C9]" : "bg-[#FFF1C6] text-[#2D0C72]"}`}
                  >
                    {project.name}
                    {isSelected && <CheckCircle2 className="w-5 h-5" />}
                  </button>

                  {/* Dropdown Content */}
                  <AnimatePresence initial={false}>
                    {isSelected && project.description && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="bg-[#FFF1C6] px-4 py-3 text-sm text-[#2D0C72]"
                      >
                        <p className="mb-1">{project.description}</p>
                        <a
                          href={`https://${project.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline text-sm"
                        >
                          {project.link}
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {selectedId && (
            <div className="bg-gradient-to-t mt-5 from-[#2D0C72] pb-2">
              <button
                className="w-40 bg-yellow-400 text-[#2D0C72] py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
                onClick={() => console.log('Continue with:', selectedId)}
              >
                Continue
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
