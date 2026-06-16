import React from "react";
import { Link } from "react-router-dom";

const DashboardSidebar = ({ active, onChange }) => {
  return (
    <aside className="w-64 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Dashboard</h3>
      <nav className="flex flex-col gap-2">
        <button
          className={`text-left p-2 rounded ${active === "listings" ? "bg-slate-100" : ""}`}
          onClick={() => onChange("listings")}
        >
          My Listings
        </button>
        <button
          className={`text-left p-2 rounded ${active === "activity" ? "bg-slate-100" : ""}`}
          onClick={() => onChange("activity")}
        >
          My Activity
        </button>
        <Link to="/add" className="mt-3 inline-block p-2 rounded bg-slate-900 text-white text-center">
          Add new listing
        </Link>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
