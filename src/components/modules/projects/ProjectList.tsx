/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProjectCard } from "./ProjectCard";




export default function ProjectList({ projects, onEdit, onDelete,isLoading,isDeleting }: any) {

if(isLoading) {
  return (
    <div className="flex justify-center items-center h-full">
      <p className="text-gray-500">Loading projects...</p>
    </div>
  );
}
  if (!projects?.length) {
    return <p className="text-gray-500">No projects yet. Add one.</p>;
  }


  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects?.map((project: any) => (
        <ProjectCard
          key={project?._id}
          project={project?.basicInfo}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
