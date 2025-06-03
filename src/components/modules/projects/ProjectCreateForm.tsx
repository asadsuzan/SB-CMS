/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { TProjectStatus, TProjectCategory } from "@/types";
import Image from "next/image";
import { InputField, Label, Section, SelectField, TextAreaField } from "@/components/forms";
import { useForm } from "@/hooks/UseForm";
import { config } from "@/config";

type FormType = {
  basicInfo: {
    title: string;
    slug: string;
    description: string;
  };
  meta: {
    status: TProjectStatus;
    category: TProjectCategory;
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
  screenshots: File[];
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


type ProjectFormProps = {
  onSuccess?: () => void;
};

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
 // Form state management using custom hook
const {form,setForm,handleArrayChange,handleChange,addArrayItem,removeArrayItem} = useForm<FormType>({
    basicInfo: { title: "", slug: "", description: "" },
    meta: {
      status: "completed",
      category: "full-stack-development",
      client: "",
      timeframe: "Oct 2023 – Jan 2024", // Default timeframe
    },
    links: { githubUrl: "", liveDemoUrl: "" },
    overview: { context: "", targetAudience: "", objectives: [""] },
    screenshots: [],
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
})
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const validFiles = files
      .filter(
        (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
      )
      .slice(0, 3 - form.screenshots.length); // Limit to remaining slots

    if (validFiles.length < files.length) {
      alert("Only image files under 5MB are accepted. Max 3 files allowed total.");
    }

    setForm((prev) => ({ ...prev, screenshots: [...prev.screenshots, ...validFiles] }));
  };

  const removeScreenshot = (index: number) => {
    setForm((prev) => {
      const updatedFiles = [...prev.screenshots];
      updatedFiles.splice(index, 1);
      return { ...prev, screenshots: updatedFiles };
    });
  };

 
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const formData = new FormData();
    const { screenshots, ...jsonData } = form;

    formData.append("data", JSON.stringify(jsonData));

    screenshots.forEach((file) => {
      formData.append("screenshots", file);
    });

    try {
      const url = `${config.sb_backOfficeApiUrl}/projects`; 
      const method = "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add new project");
      }

      await response.json();
      setSubmitMessage({
        type: "success",
        text: "Project created successfully!",
      });

      // Clear the form after successful submission
      setForm({
        basicInfo: { title: "", slug: "", description: "" },
        meta: {
          status: "completed",
          category: "full-stack-development",
          client: "",
          timeframe: "Oct 2023 – Jan 2024",
        },
        links: { githubUrl: "", liveDemoUrl: "" },
        overview: { context: "", targetAudience: "", objectives: [""] },
        screenshots: [],
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
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear file input
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setSubmitMessage({
        type: "error",
        text: error.message || "An unexpected error occurred.",
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
          disabled={form.screenshots.length >= 3} // Max 3 images total
        >
          {form.screenshots.length > 0 ? "Add More Images" : "Upload Images"}
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

      {form.screenshots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {form.screenshots.map((file, i) => (
            <div key={`new-${i}`} className="relative group">
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview ${i + 1}`}
                width={400}
                height={192}
                className="w-full h-48 object-contain border rounded-lg bg-gray-100 p-2"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => removeScreenshot(i)}
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
                {file.name}
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
        Create New Project
      </h2>

      {submitMessage && (
        <div
          className={`p-3 rounded-md ${
            submitMessage.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      {/* Section: Basic Information */}
      <Section title="Basic Information">
        <InputField
          label="Project Title"
          value={form.basicInfo.title}
          onChange={(e) => handleChange("basicInfo", "title", e.target.value)}
          required
        />
        <InputField
          label="URL Slug"
          value={form.basicInfo.slug}
          onChange={(e) => handleChange("basicInfo", "slug", e.target.value)}
          placeholder="e.g., my-awesome-project"
          required
        />
        <TextAreaField
          label="Description"
          value={form.basicInfo.description}
          onChange={(e) =>
            handleChange("basicInfo", "description", e.target.value)
          }
          required
        />
      </Section>

      {/* Section: Project Metadata */}
      <Section title="Project Metadata">
        <SelectField
          label="Project Category"
          value={form.meta.category}
          onChange={(e) =>
            handleChange("meta", "category", e.target.value as TProjectCategory)
          }
          options={[
            { value: "full-stack-development", label: "Full Stack Development" },
            { value: "frontend-development", label: "Frontend Development" },
            { value: "backend-development", label: "Backend Development" },
            { value: "mobile-app-development", label: "Mobile App Development" },
            { value: "data-science", label: "Data Science" },
            { value: "machine-learning", label: "Machine Learning" },
            { value: "devops", label: "DevOps" },
            { value: "ui-ux-design", label: "UI/UX Design" },
          ]}
        />
        <SelectField
          label="Project Status"
          value={form.meta.status}
          onChange={(e) =>
            handleChange("meta", "status", e.target.value as TProjectStatus)
          }
          options={[
            { value: "completed", label: "Completed" },
            { value: "in-progress", label: "In Progress" },
            { value: "planned", label: "Planned" },
          ]}
        />
        <InputField
          label="Client"
          value={form.meta.client}
          onChange={(e) => handleChange("meta", "client", e.target.value)}
        />
        <InputField
          label="Timeframe"
          value={form.meta.timeframe}
          onChange={(e) => handleChange("meta", "timeframe", e.target.value)}
          placeholder="e.g., Oct 2023 – Jan 2024"
        />
      </Section>

      {/* Section: Project Links */}
      <Section title="Project Links">
        <InputField
          label="GitHub URL"
          type="url"
          value={form.links.githubUrl}
          onChange={(e) => handleChange("links", "githubUrl", e.target.value)}
          placeholder="https://github.com/your-project"
        />
        <InputField
          label="Live Demo URL"
          type="url"
          value={form.links.liveDemoUrl}
          onChange={(e) => handleChange("links", "liveDemoUrl", e.target.value)}
          placeholder="https://your-project-demo.com"
        />
      </Section>

      {/* Section: Project Overview */}
      <Section title="Project Overview">
        <TextAreaField
          label="Context"
          value={form.overview.context}
          onChange={(e) => handleChange("overview", "context", e.target.value)}
          required
        />
        <TextAreaField
          label="Target Audience"
          value={form.overview.targetAudience}
          onChange={(e) =>
            handleChange("overview", "targetAudience", e.target.value)
          }
        />

        <div className="space-y-3">
          <Label>Objectives</Label>
          {form.overview.objectives.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="input flex-1"
                value={item}
                onChange={(e) =>
                  handleArrayChange("overview", i, e.target.value, "objectives")
                }
                placeholder={`Objective ${i + 1}`}
                required
              />
              <button
                type="button"
                className="btn-danger"
                onClick={() => removeArrayItem("overview", i, "objectives")}
                disabled={form.overview.objectives.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => addArrayItem("overview", "objectives")}
            disabled={form.overview.objectives.length >= 5}
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
              className="input flex-1"
              value={item}
              onChange={(e) => handleArrayChange("features", i, e.target.value)}
              placeholder={`Feature ${i + 1}`}
            />
            <button
              type="button"
              className="btn-danger"
              onClick={() => removeArrayItem("features", i)}
              disabled={form.features.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary"
          onClick={() => addArrayItem("features")}
          disabled={form.features.length >= 10}
        >
          + Add Feature
        </button>
      </Section>

      {/* Section: Technologies */}
      <Section title="Technologies Used">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(form.technologies).map(([key, value]) => (
            <InputField
              key={key}
              label={key.replace(/([A-Z])/g, " $1").toUpperCase()}
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
        {form.lessonsLearned.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="input flex-1"
              value={item}
              onChange={(e) =>
                handleArrayChange("lessonsLearned", i, e.target.value)
              }
              placeholder={`Lesson ${i + 1}`}
            />
            <button
              type="button"
              className="btn-danger"
              onClick={() => removeArrayItem("lessonsLearned", i)}
              disabled={form.lessonsLearned.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary"
          onClick={() => addArrayItem("lessonsLearned")}
          disabled={form.lessonsLearned.length >= 10}
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
          className="btn-primary w-full py-3 text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Project"}
        </button>
      </div>
    </form>
  );
}

