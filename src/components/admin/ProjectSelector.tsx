"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MdAdd,
  MdClose,
  MdDragIndicator,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { Button } from "@/components/ui/button";

interface Project {
  _id: string;
  title: string;
  slug: string;
  heroSection?: {
    thumbnail?: {
      url?: string;
    };
  };
  technologies?: string[];
}

interface SelectedProject {
  projectId: string;
  order: number;
  isVisible: boolean;
}

interface ProjectSelectorProps {
  selectedProjects: SelectedProject[];
  onChange: (projects: SelectedProject[]) => void;
}

export default function ProjectSelector({
  selectedProjects,
  onChange,
}: ProjectSelectorProps) {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Fetch all projects (draft and published) for admin to choose from
      const response = await fetch("/api/projects?status=all");
      const data = await response.json();
      if (data.success) {
        setAllProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getProjectDetails = (projectId: string) => {
    return allProjects.find((p) => p._id === projectId);
  };

  const handleAddProject = (projectId: string) => {
    const newProject: SelectedProject = {
      projectId,
      order: selectedProjects.length,
      isVisible: true,
    };
    onChange([...selectedProjects, newProject]);
    setIsSelecting(false);
  };

  const handleRemoveProject = (projectId: string) => {
    const updated = selectedProjects
      .filter((p) => p.projectId !== projectId)
      .map((p, index) => ({ ...p, order: index }));
    onChange(updated);
  };

  const handleToggleVisibility = (projectId: string) => {
    const updated = selectedProjects.map((p) =>
      p.projectId === projectId ? { ...p, isVisible: !p.isVisible } : p,
    );
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...selectedProjects];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated.forEach((p, i) => (p.order = i));
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedProjects.length - 1) return;
    const updated = [...selectedProjects];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((p, i) => (p.order = i));
    onChange(updated);
  };

  const availableProjects = allProjects.filter(
    (p) => !selectedProjects.some((sp) => sp.projectId === p._id),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Featured Projects</h3>
        <Button
          onClick={() => setIsSelecting(!isSelecting)}
          variant="outline"
          size="sm"
        >
          {isSelecting ? "Cancel" : "Add Project"}
        </Button>
      </div>

      {isSelecting && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
          <h4 className="text-sm font-medium mb-3">Select a project to add:</h4>
          {loading ? (
            <p className="text-sm text-gray-500">Loading projects...</p>
          ) : allProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-4">
                No projects found. Create a project first!
              </p>
              <Button variant="default" size="sm" asChild>
                <Link
                  href="/admin/projects/new"
                  className="inline-flex items-center"
                >
                  <MdAdd className="mr-2" size={18} />
                  Create Your First Project
                </Link>
              </Button>
            </div>
          ) : availableProjects.length === 0 ? (
            <p className="text-sm text-gray-500">
              All projects are already featured!
            </p>
          ) : (
            <div className="grid gap-2">
              {availableProjects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => handleAddProject(project._id)}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors text-left"
                >
                  {((project as any).sections?.hero?.heroImage?.url ||
                    (project as any).thumbnail?.url) && (
                    <img
                      src={
                        (project as any).sections?.hero?.heroImage?.url ||
                        (project as any).thumbnail?.url
                      }
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium">{project.title}</h5>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          (project as any).status === "published"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {(project as any).status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">/{project.slug}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {selectedProjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              No projects featured on homepage yet.
            </p>
            {allProjects.length === 0 ? (
              <div>
                <p className="text-xs text-gray-500 mb-3">
                  Create a case study project first, then feature it here!
                </p>
                <Button variant="default" size="sm" asChild>
                  <Link
                    href="/admin/projects/new"
                    className="inline-flex items-center"
                  >
                    <MdAdd className="mr-2" size={18} />
                    Create Project
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Click "Add Project" above to feature published projects on your
                homepage.
              </p>
            )}
          </div>
        ) : (
          selectedProjects.map((selectedProject, index) => {
            const project = getProjectDetails(selectedProject.projectId);
            if (!project) return null;

            return (
              <div
                key={selectedProject.projectId}
                className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-gray-800"
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === selectedProjects.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>

                <MdDragIndicator className="text-gray-400" size={20} />

                {((project as any).sections?.hero?.heroImage?.url ||
                  (project as any).thumbnail?.url) && (
                  <img
                    src={
                      (project as any).sections?.hero?.heroImage?.url ||
                      (project as any).thumbnail?.url
                    }
                    alt={project.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{project.title}</h5>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        (project as any).status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {(project as any).status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Order: {index + 1}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      handleToggleVisibility(selectedProject.projectId)
                    }
                    variant="outline"
                    size="sm"
                  >
                    {selectedProject.isVisible ? (
                      <MdVisibility size={18} />
                    ) : (
                      <MdVisibilityOff size={18} />
                    )}
                  </Button>
                  <Button
                    onClick={() =>
                      handleRemoveProject(selectedProject.projectId)
                    }
                    variant="destructive"
                    size="sm"
                  >
                    <MdClose size={18} />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
