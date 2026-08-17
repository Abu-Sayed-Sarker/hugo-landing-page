"use client";

import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import UniNavbar from "../University/UniNavbar";

export default function AdminMain() {
  return (
    <div className="flex h-screen bg-base">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <UniNavbar />

        <main className="overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
