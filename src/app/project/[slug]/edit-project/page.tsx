/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProjectUpdateForm from "@/components/modules/projects/ProjectUpdateForm";
import { config } from "@/config";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateProjectPage(){
    const {slug} = useParams<{slug: string}>();
    const [project,setProject] = useState<any>(null);

    useEffect(()=>{
        if(slug) {
            // Fetch the project data based on the slug
            fetch(`${config.sb_backOfficeApiUrl}/projects/${slug}`)
                .then(response => response.json())
                .then(data => {
                    setProject(data?.data)
                    console.log("Fetched project data:", data?.data);
                })
                .catch(error => console.error('Error fetching project:', error));
        }

    },[slug]);

  if(!slug) {
    return <div className="h-screen flex items-center justify-center">Project slug is missing</div>;
  }
    return (
        <div className=" h-screen">
         
  <ProjectUpdateForm project={project}  onSuccess={()=>console.log('updated')}/>
        </div>
    )
}