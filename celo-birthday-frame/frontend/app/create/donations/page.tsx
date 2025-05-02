import React from "react";
import Projects from "@/components/donations/Projects";
import Categories from "@/components/donations/Categories";
import ConfirmationPage from "@/components/donations/Confirmation";

export default function DonationsPage() {

  return (
    // <Projects />
    // <Categories />


    <ConfirmationPage
      type="donation"
      celebrant="Sarah"
      category="Education"
      projectTitle="TechBridge"
      projectUrl="giveth.io/project/techbridge"
    />

  );
}
