'use client'

import React, { useState } from "react";
import Projects from "@/components/donations/Projects";
import Categories from "@/components/donations/Categories";
import ConfirmationPage from "@/components/donations/Confirmation";
import { useRouter } from 'next/navigation'
import { ArrowLeft } from "lucide-react";
import { Project } from "@/apollo/types";
export default function DonationsPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [steps, setSteps] = useState(0);

  const handleSteps = () => {
    if (steps == 0) {
      router.push('/create')
    }
    if (steps == 1) {
      setSteps(0)
    }

    if (steps == 2) {
      setSteps(1)
    }
  }

  return (

    <div className="min-h-screen bg-[#2D0C72] px-6 py-10  overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start mt-4 h-screen">

        {/* Back Button */}
        <div className="w-full max-w-sm flex items-start">
          <button className="text-yellow-400 hover:text-yellow-300 text-2xl" onClick={handleSteps}>
            <ArrowLeft />
          </button>
        </div>
        {steps == 0 && <Categories setCategoryFn={setCategory} setStepFn={setSteps} />}
        {steps == 1 && <Projects category={category} setProjectFn={setProject} setStepsFn={setSteps} />}

        {steps == 2 && project &&
          <ConfirmationPage
            type="donation"
            celebrant="Sarah"
            category="Education"
            project={project}
          />
        }
      </div>
    </div>
  );
}
