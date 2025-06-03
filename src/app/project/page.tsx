/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ProjectList from "@/components/modules/projects/ProjectList";
import { config } from "@/config";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const fetchProjects = async () => {
    setLoading(true);
    setToastMessage(null);

    try {
      const response = await fetch(`${config.sb_backOfficeApiUrl}/projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        setToastMessage({
          type: "error",
          text: "Failed to fetch projects. Please try again.",
        });
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data?.data || []);
    } catch (e) {
      console.error("Error fetching projects:", e);
      setToastMessage({
        type: "error",
        text: "Failed to fetch projects. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects when the component mounts

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (slug: string) => {
    setIsDeleting(true);
    setToastMessage(null);
console.log("Deleting project with slug:", slug);
    try {
      const response = await fetch(
        `${config.sb_backOfficeApiUrl}/projects/${slug}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to delete project:", response);
        setToastMessage({
          type: "error",
          text: "Failed to delete project. Please try again.",
        });
        throw new Error("Failed to delete project");
      }
      setToastMessage({
        type: "success",
        text: "Project deleted successfully.",
      });

      // Refresh the project list after deletion
      fetchProjects();
    } catch (e) {
      console.error("Error deleting project:", e);

      setToastMessage({
        type: "error",
        text: "Failed to delete project. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (slug: string) => {
    router.push(`/project/${slug}/edit-project/`);
  };

  const handleToastClose = () => {
    setToastMessage(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Projects</h2>
        {toastMessage && (
          <div
            className={`p-3 

          top-4 right-4 z-50 transition-all duration-300 ease-in-out shadow-md cursor-pointer
          ${
            toastMessage.type === "success"
              ? "animate-fadeIn"
              : "animate-fadeOut"
          }
          relative bg-opacity-90 text-sm text-center max-w-md mx-auto flex items-center justify-between space-x-4
          

            
            rounded-md ${
              toastMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {toastMessage.text}

            <button
              onClick={handleToastClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <Link
          href="/project/create-project"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
        >
          + Add Project
        </Link>
      </div>

      <ProjectList
        isLoading={loading}
        isDeleting={isDeleting}
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
