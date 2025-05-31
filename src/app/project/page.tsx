/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProjectList from '@/components/modules/projects/ProjectList';
import Link from 'next/link';

import { useState } from 'react';


export default function ProjectsPage() {
 const [projects, setProjects] = useState<any[]>([
  {
    id: 1,
    name: 'Portfolio Website',
    description: 'A personal portfolio built with Next.js and Tailwind CSS.',
  },
  {
    id: 2,
    name: 'Blog CMS',
    description: 'A full-featured content management system for writing blogs.',
  },
  {
    id: 3,
    name: 'Task Manager App',
    description: 'A MERN stack app to manage daily tasks and priorities.',
  },
  {
    id: 4,
    name: 'E-commerce Store',
    description: 'A responsive online store built with React, Redux, and Stripe.',
  },
  {
    id: 5,
    name: 'Chat App',
    description: 'A real-time chat application using Socket.IO and Express.',
  },
]);











  const handleDelete = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };



  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <Link
          href="/project/create-project"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
        >
          + Add Project
        </Link>
      </div>

      <ProjectList
        projects={projects}
      
        onDelete={handleDelete}
      />
    </div>
  );
}
