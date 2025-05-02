'use client'

import React, { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const categories = [
  { id: "education", label: "Education" },
  { id: "health", label: "Health" },
  { id: "climate", label: "Climate" },
  { id: "food", label: "Food" },
  { id: "water", label: "Water" },
  { id: "shelter", label: "Shelter" },
  { id: "mental-health", label: "Mental Health" },
  { id: "animal-welfare", label: "Animal Welfare" },
  { id: "disaster-relief", label: "Disaster Relief" },
  { id: "technology-access", label: "Technology Access" },
  { id: "gender-equality", label: "Gender Equality" },
  { id: "child-support", label: "Child Support" }
];

export default function Categories() {

  const [selectedId, setSelectedId] = useState<string | null>("education");

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10  overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start mt-4 h-screen">
        {/* Back Button */}
        <div className="w-full max-w-sm flex items-start">
          <button className="text-yellow-400 hover:text-yellow-300 text-2xl">
            <ArrowLeft />
          </button>
        </div>


        {/* Main Headline */}
        <h1 className="text-[#FFF8C9] text-2xl -mt-4 sm:text-3xl font-bold mb-4 leading-snug">
          Choose a <br />
          donation <br />
          category
        </h1>

        <div className="w-full max-w-sm h-[600px]">
          <div className="flex flex-col overflow-y-auto py-2 max-h-[calc(100vh-350px)] space-y-4 scrollbar-hide items-center" style={{ scrollbarWidth: 'none' }}>
            {categories.map((category) => {
              const isSelected = selectedId === category.id;
              return ((
                <button
                  key={category.id}
                  onClick={() => setSelectedId(category.id)}
                  className={`w-full max-w-xs bg-[#FFF1C6] text-[#2D0C72] text-lg font-semibold px-4 py-4 rounded-2xl 
                      shadow-sm hover:scale-[1.02] transition-all flex justify-between items-center
                      ${isSelected ? "bg-teal-600 text-[#FFF8C9]" : "bg-[#FFF1C6] text-[#2D0C72]"}`}
                >
                  {category.label}
                  {isSelected && <CheckCircle2 className="w-5 h-5" />}
                </button>
              ))
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
