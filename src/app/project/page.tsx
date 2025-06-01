/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProjectList from '@/components/modules/projects/ProjectList';
import { config } from '@/config';
import Link from 'next/link';

import { useEffect, useState } from 'react';


export default function ProjectsPage() {
 const [projects, setProjects] = useState<any[]>([]);
 const  [loading, setLoading] = useState<boolean>(false);


 const fetchProjects=async()=>{
  setLoading(true);

  try{
    const response = await fetch(`${config.sb_backOfficeApiUrl}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data = await response.json();
    setProjects(data?.data || []);
  }catch(e){
    console.error('Error fetching projects:', e);
  }finally{
    setLoading(false);
  }

 }

  // Fetch projects when the component mounts

  useEffect(()=>{

    fetchProjects();

  },[])




  const handleDelete = (id: number) => {
    setProjects((prev) => prev?.filter((p) => p.id !== id));
  };

  if (loading) {
    return <div className="text-center">Loading projects...</div>;
  }


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
