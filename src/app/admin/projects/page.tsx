"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { Button } from "@/components/ui/button";

const Toast = dynamic(() => import("@/components/Toast"), { ssr: false });

interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: {
    url: string;
    alt: string;
  };
  technologies: string[];
  status: "draft" | "published";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects?status=${filter}`);
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      showMessage("error", "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        showMessage("success", "Project deleted successfully");
        fetchProjects();
      } else {
        showMessage("error", result.error || "Failed to delete project");
      }
    } catch (_error) {
      showMessage("error", "Failed to delete project");
    }
  };

  const toggleStatus = async (project: Project) => {
    try {
      const newStatus = project.status === "published" ? "draft" : "published";
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project._id,
          status: newStatus,
        }),
      });

      const result = await response.json();
      if (result.success) {
        showMessage(
          "success",
          `Project ${newStatus === "published" ? "published" : "unpublished"}`,
        );
        fetchProjects();
      } else {
        showMessage("error", result.error || "Failed to update status");
      }
    } catch (_error) {
      showMessage("error", "Failed to update status");
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
              Projects
            </h1>
            <p className="text-[var(--text-secondary)]">
              Manage your portfolio projects and case studies
            </p>
          </div>
          <Link href="/admin/projects/new">
            <Button className="flex items-center gap-2">
              <MdAdd size={20} />
              New Project
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-12 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              No projects found
            </p>
            <Link href="/admin/projects/new">
              <Button>Create Your First Project</Button>
            </Link>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-[var(--surface)] rounded-lg border border-[var(--border)] overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-[var(--surface-hover)]">
                  {project.thumbnail?.url ? (
                    <img
                      src={project.thumbnail.url}
                      alt={project.thumbnail.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                      No Image
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === "published"
                          ? "bg-green-500/20 text-green-400 border border-green-400/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                    {project.shortDescription}
                  </p>

                  {/* Technologies */}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 text-[var(--text-secondary)] text-xs">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/${project._id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1"
                      >
                        <MdEdit size={16} />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(project)}
                      title={
                        project.status === "published" ? "Unpublish" : "Publish"
                      }
                    >
                      {project.status === "published" ? (
                        <MdVisibilityOff size={18} />
                      ) : (
                        <MdVisibility size={18} />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project._id, project.title)}
                      title="Delete"
                    >
                      <MdDelete size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
