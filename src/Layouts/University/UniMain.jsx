"use client";

import UniNavbar from "./UniNavbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function UniMain() {
  return (
    <div className="flex h-screen bg-base">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <UniNavbar />

        <main className="overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
