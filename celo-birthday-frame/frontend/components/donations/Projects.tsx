'use client'

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@apollo/client";
import { FETCH_ALL_PROJECTS, FETCH_PROJECT_BY_ID } from "@/apollo/gql/gqlProjects";
import { FetchAllProjectsResponse, Project, ProjectByIdQuery } from "@/apollo/types";
import { cleanDescription, projectUrl } from "@/lib/helpers";

interface Props {
  category: string;
  setProjectFn: React.Dispatch<React.SetStateAction<Project | null>>;
  setStepsFn: React.Dispatch<React.SetStateAction<number>>;
}

export default function Projects({ category, setProjectFn, setStepsFn }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, loading, error } = useQuery<FetchAllProjectsResponse>(FETCH_ALL_PROJECTS, {
    variables: { category: 'peace-and-justice' },
    fetchPolicy: "cache-first"
  });


  if (loading) {
    return (
      <p className="text-[#FFF8C9] text-2xl font-bold mt-4">
        Loading projects...
      </p>
    );
  }

  if (error || !data?.allProjects?.projects.length) {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <p className="text-[#FFF8C9] text-2xl font-bold">
          Failed to load Projects.
        </p>
        <button
          onClick={() => setStepsFn(0)}
          className="bg-yellow-400 text-[#2D0C72] px-4 py-2 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-start">
      <h1 className="text-[#FFF8C9] text-2xl -mt-4 sm:text-3xl font-bold mb-4 leading-snug">
        Choose a <br />
        project
      </h1>

      <div className="w-full max-w-sm h-[600px] relative">
        <div className="overflow-y-auto py-2 max-h-[calc(100vh-400px)] space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {data.allProjects.projects.map((project) => {
            const isSelected = selectedId === project.id;
            return (
              <div key={project.id} className="rounded-2xl overflow-hidden shadow-sm hover:scale-[1.01] transition-all">
                <button
                  onClick={() => {
                    setSelectedId(project.id);
                    setProjectFn(project);
                  }}
                  className={`w-full text-left px-4 py-4 text-lg font-semibold flex justify-between items-center
                    ${isSelected ? "bg-teal-600 text-[#FFF8C9]" : "bg-[#FFF1C6] text-[#2D0C72]"}`}
                >
                  {project.title}
                  {isSelected && <CheckCircle2 className="w-5 h-5" />}
                </button>

                <AnimatePresence initial={false}>
                  {isSelected && project.descriptionSummary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-[#FFF1C6] px-4 py-3 text-sm text-[#2D0C72]"
                    >
                      <p className="mb-1">{cleanDescription(project.descriptionSummary)}</p>
                      <a
                        href={projectUrl(project.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline text-sm"
                      >
                        {projectUrl(project.slug)}
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
              onClick={() => setStepsFn(2)}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
