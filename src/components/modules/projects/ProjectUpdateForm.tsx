/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, FormEvent, useRef, useState } from "react";
import Image from "next/image";

// Import types from your types directory
import { TProjectStatus, TProjectCategory, TProject } from "@/types";
// Import the custom hook for form management
import { useForm } from "@/hooks/UseForm";
import { InputField, Label, Section, SelectField, TextAreaField } from "@/components/forms";
import { config } from "@/config";

// Form type
type FormType = {
  basicInfo: {
    title: string;
    slug: string;
    description: string;
  };
  meta: {
    status: TProjectStatus;
    category: TProjectCategory; // You might want this to be a select field too
    client: string;
    timeframe: string;
  };
  links: {
    githubUrl: string;
    liveDemoUrl: string;
  };
  overview: {
    context: string;
    targetAudience: string;
    objectives: string[];
  };
  newScreenshots: File[];
  // existingScreenshotUrls will be handled by a separate state for deletions
  // and passed with `dataToSend` in handleSubmit
  features: string[];
  technologies: {
    frontend: string;
    backend: string;
    database: string;
    realTime: string;
    deployment: string;
    thirdPartyAPI: string;
  };
  lessonsLearned: string[];
};

type ProjectUpdateFormProps = {
  project: TProject;
  onSuccess?: () => void;
};

export default function ProjectUpdateForm({
  project,
  onSuccess,
}: ProjectUpdateFormProps) {
  // Initialize useForm with a default empty state
  const { form, setForm, handleChange, handleArrayChange, addArrayItem, removeArrayItem } = useForm<FormType>({
    basicInfo: { title: "", slug: "", description: "" },
    meta: {
      status: "completed",
      category: "full-stack-development",
      client: "",
      timeframe: "Oct 2023 – Jan 2024",
    },
    links: { githubUrl: "", liveDemoUrl: "" },
    overview: { context: "", targetAudience: "", objectives: [""] },
    newScreenshots: [],
    // existingScreenshotUrls is not part of the `form` state managed by useForm
    // because its management for deletion is different.
    features: [""],
    technologies: {
      frontend: "",
      backend: "",
      database: "",
      realTime: "",
      deployment: "",
      thirdPartyAPI: "",
    },
    lessonsLearned: [""],
  });

  // State to manage existing screenshots (URLs from the DB) that are currently selected to be kept
  // This remains separate because its lifecycle is different from typical form inputs (addition/removal implies actual DB changes).
  const [currentExistingScreenshots, setCurrentExistingScreenshots] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Initialize form and existing screenshots with project data on mount/project change
  useEffect(() => {
    if (project) {
      setForm({ // Use setForm from the hook to hydrate the form state
        basicInfo: {
          title: project.basicInfo?.title || "",
          slug: project.basicInfo?.slug || "",
          description: project.basicInfo?.description || "",
        },
        meta: {
          status: project.meta?.status || "completed",
          category: project.meta?.category || "full-stack-development",
          client: project.meta?.client || "",
          timeframe: project.meta?.timeframe || "Oct 2023 – Jan 2024",
        },
        links: {
          githubUrl: project.links?.githubUrl || "",
          liveDemoUrl: project.links?.liveDemoUrl || "",
        },
        overview: {
          context: project.overview?.context || "",
          targetAudience: project.overview?.targetAudience || "",
          objectives: project.overview?.objectives || [""],
        },
        newScreenshots: [], // Always start with no new files
        features: project.features || [""],
        technologies: {
          frontend: project.technologies?.frontend || "",
          backend: project.technologies?.backend || "",
          database: project.technologies?.database || "",
          realTime: project.technologies?.realTime || "",
          deployment: project.technologies?.deployment || "",
          thirdPartyAPI: project.technologies?.thirdPartyAPI || "",
        },
        lessonsLearned: project.lessonsLearned || [""],
      });

      // Initialize existing screenshots from the project data
      if (project.screenshots) {
        setCurrentExistingScreenshots(project.screenshots);
      }
    }
  }, [project, setForm]); // Add setForm to dependency array of useEffect

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const maxFiles = 3 - currentExistingScreenshots.length;
    const validFiles = files
      .filter(
        (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
      )
      .slice(0, maxFiles);

    if (validFiles.length < files.length) {
      alert(`Only image files under 5MB are accepted. You can add up to ${maxFiles} more images.`);
    }

    setForm((prev) => ({ ...prev, newScreenshots: [...prev.newScreenshots, ...validFiles] }));
  };

  const removeNewScreenshot = (index: number) => {
    setForm((prev) => {
      const updatedFiles = [...prev.newScreenshots];
      updatedFiles.splice(index, 1);
      return { ...prev, newScreenshots: updatedFiles };
    });
  };

  const removeExistingScreenshot = (urlToRemove: string) => {
    setCurrentExistingScreenshots(prev => prev.filter(url => url !== urlToRemove));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const formData = new FormData();
    // Exclude newScreenshots from jsonData as they are appended separately
    const { newScreenshots, ...jsonData } = form;

    const dataToSend = {
      ...jsonData,
      existingScreenshotUrls: currentExistingScreenshots,
    };

    formData.append("data", JSON.stringify(dataToSend));

    newScreenshots.forEach((file) => {
      formData.append("screenshots", file);
    });

    try {
      const response = await fetch(`${config.sb_backOfficeApiUrl}/projects/${project.basicInfo.slug}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      await response.json();
      setSubmitMessage({
        type: 'success',
        text: 'Project updated successfully!'
      });

      setForm(prev => ({ ...prev, newScreenshots: [] })); // Clear new files

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Error updating project:", error);
      setSubmitMessage({
        type: 'error',
        text: error.message || 'An unexpected error occurred while updating the project.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderScreenshots = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn-primary" 
          onClick={triggerFileInput}
          disabled={form?.newScreenshots?.length + currentExistingScreenshots?.length >= 3}
        >
          {form?.newScreenshots?.length + currentExistingScreenshots?.length > 0 ? "Add More Images" : "Upload Images"}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-sm text-gray-500">Max 3 images (5MB each)</p>
      </div>

      {(form?.newScreenshots?.length > 0 || currentExistingScreenshots?.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentExistingScreenshots?.map((url, i) => (
            <div key={`existing-${i}`} className="relative group">
              <Image
                src={url}
                alt={`Existing Screenshot ${i + 1}`}
                width={400}
                height={192}
                className="w-full h-48 object-contain border rounded-lg bg-gray-100 p-2"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => removeExistingScreenshot(url)}
                  className="bg-red-500 text-white rounded-full p-1 shadow-lg"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 truncate mt-1">
                Existing Image {i + 1}
              </p>
            </div>
          ))}

          {form?.newScreenshots?.map((file, i) => (
            <div key={`new-${i}`} className="relative group">
              <Image
                src={URL.createObjectURL(file)}
                alt={`New Screenshot Preview ${i + 1}`}
                width={400}
                height={192}
                className="w-full h-48 object-contain border rounded-lg bg-gray-100 p-2"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => removeNewScreenshot(i)}
                  className="bg-red-500 text-white rounded-full p-1 shadow-lg"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 truncate mt-1">
                {file?.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Update Project: {project?.basicInfo?.title || 'Untitled Project'}
      </h2>

      {submitMessage && (
        <div className={`p-3 rounded-md ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitMessage.text}
        </div>
      )}

      {/* Section: Basic Information */}
      <Section title="Basic Information">
        <InputField
          label="Project Title"
          value={form?.basicInfo?.title}
          onChange={(e) =>
            handleChange("basicInfo", "title", e.target.value)
          }
          required
        />
        <InputField
          label="URL Slug"
          value={form?.basicInfo?.slug}
          onChange={(e) =>
            handleChange("basicInfo", "slug", e.target.value)
          }
          placeholder="e.g., my-awesome-project"
          required
        />
        <TextAreaField
          label="Description"
          value={form?.basicInfo?.description}
          onChange={(e) =>
            handleChange("basicInfo", "description", e.target.value)
          }
          required
        />
      </Section>

      {/* Section: Project Metadata */}
      <Section title="Project Metadata">
        <SelectField
          label="Project Status"
          value={form?.meta?.status}
          onChange={(e) =>
            handleChange("meta", "status", e.target.value as TProjectStatus)
          }
          options={[
            { value: "completed", label: "Completed" },
            { value: "in-progress", label: "In Progress" },
            { value: "planned", label: "Planned" },
          ]}
        />
         {/* Assuming TProjectCategory is also a select or input string */}
        <InputField
          label="Project Category"
          value={form?.meta?.category}
          onChange={(e) =>
            handleChange("meta", "category", e.target.value as TProjectCategory)
          }
          placeholder="e.g., full-stack-development"
        />
        <InputField
          label="Client"
          value={form?.meta?.client}
          onChange={(e) =>
            handleChange("meta", "client", e.target.value)
          }
        />
        <InputField
          label="Timeframe"
          value={form?.meta?.timeframe}
          onChange={(e) =>
            handleChange("meta", "timeframe", e.target.value)
          }
          placeholder="e.g., Oct 2023 – Jan 2024"
        />
      </Section>

      {/* Section: Project Links */}
      <Section title="Project Links">
        <InputField
          label="GitHub URL"
          type="url"
          value={form?.links?.githubUrl}
          onChange={(e) =>
            handleChange("links", "githubUrl", e.target.value)
          }
          placeholder="https://github.com/your-project"
        />
        <InputField
          label="Live Demo URL"
          type="url"
          value={form?.links?.liveDemoUrl}
          onChange={(e) =>
            handleChange("links", "liveDemoUrl", e.target.value)
          }
          placeholder="https://your-project-demo.com"
        />
      </Section>

      {/* Section: Project Overview */}
      <Section title="Project Overview">
        <TextAreaField
          label="Context"
          value={form?.overview?.context}
          onChange={(e) =>
            handleChange("overview", "context", e.target.value)
          }
          required
        />
        <TextAreaField
          label="Target Audience"
          value={form?.overview?.targetAudience}
          onChange={(e) =>
            handleChange("overview", "targetAudience", e.target.value)
          }
        />

        <div className="space-y-3">
          <Label>Objectives</Label>
          {form?.overview?.objectives?.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="input flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={item}
                onChange={(e) =>
                  handleArrayChange("overview", i, e.target.value, "objectives")
                }
                placeholder={`Objective ${i + 1}`}
                required
              />
              <button
                type="button"
                className="btn-danger px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50" // Example styling
                onClick={() => removeArrayItem("overview", i, "objectives")}
                disabled={form?.overview?.objectives?.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-secondary px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50" // Example styling
            onClick={() => addArrayItem("overview", "objectives")}
            disabled={form?.overview?.objectives?.length >= 5}
          >
            + Add Objective
          </button>
        </div>
      </Section>

      {/* Section: Features */}
      <Section title="Key Features">
        {form.features.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="input flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={item}
              onChange={(e) => handleArrayChange("features", i, e.target.value)}
              placeholder={`Feature ${i + 1}`}
            />
            <button
              type="button"
              className="btn-danger px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              onClick={() => removeArrayItem("features", i)}
              disabled={form?.features?.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          onClick={() => addArrayItem("features")}
          disabled={form?.features?.length >= 10}
        >
          + Add Feature
        </button>
      </Section>

      {/* Section: Technologies */}
      <Section title="Technologies Used">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(form?.technologies).map(([key, value]) => (
            <InputField
              key={key}
              label={key.replace(/([A-Z])/g, " $1").toUpperCase()} // Dynamically create label
              value={value}
              onChange={(e) =>
                handleChange(
                  "technologies",
                  key as keyof typeof form.technologies,
                  e.target.value
                )
              }
            />
          ))}
        </div>
      </Section>

      {/* Section: Lessons Learned */}
      <Section title="Lessons Learned">
        {form?.lessonsLearned?.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="input flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={item}
              onChange={(e) =>
                handleArrayChange("lessonsLearned", i, e.target.value)
              }
              placeholder={`Lesson ${i + 1}`}
            />
            <button
              type="button"
              className="btn-danger px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              onClick={() => removeArrayItem("lessonsLearned", i)}
              disabled={form?.lessonsLearned?.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          onClick={() => addArrayItem("lessonsLearned")}
          disabled={form?.lessonsLearned?.length >= 10}
        >
          + Add Lesson
        </button>
      </Section>

      {/* Section: Screenshots */}
      <Section title="Screenshots">
        {renderScreenshots()}
      </Section>

      <div className="pt-6">
        <button
          type="submit"
          className="btn-primary w-full py-3 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" // Example styling
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Project"}
        </button>
      </div>
    </form>
  );
}