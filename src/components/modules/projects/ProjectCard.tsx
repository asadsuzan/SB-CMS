/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Pencil, Trash } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  onEdit: (project: any) => void;
  onDelete: (project: any) => void;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const  ProjectCard:React.FC<ProjectCardProps> =({ project, onEdit, onDelete }: any)=> {

  return (
    <div className="bg-white shadow-md rounded-lg p-4 relative">
      <h3 className="text-lg font-semibold">{project?.title}</h3>
      <p className="text-sm text-gray-600">{project?.description}</p>

      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => onEdit(project)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}
