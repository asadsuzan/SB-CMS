/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProjectList from '@/components/modules/projects/ProjectList';
import { config } from '@/config';
import Link from 'next/link';

import { useEffect, useState } from 'react';


export default function ProjectsPage() {
 const [projects, setProjects] = useState<any[]>([]);
 const  [loading, setLoading] = useState<boolean>(false);
 const [isDeleting, setIsDeleting] = useState<boolean>(false);


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




  const handleDelete = async(id: string) => {
    console.log('project id:' ,id)

    setIsDeleting(true)

    
    try{

      const response = await fetch(`${config.sb_backOfficeApiUrl}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      }})

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      const data = await response.json();
      console.log('Project deleted successfully:', data);
    }catch(e){console.log('Error deleting project:', e)}finally{
      setIsDeleting(false);
fetchProjects();
    }
    

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
