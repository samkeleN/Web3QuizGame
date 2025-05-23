"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("~/components/dashboard"), {
  ssr: false,
});

export default function App() {
  return <Dashboard />;
}
