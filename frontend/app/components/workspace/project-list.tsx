import type { Project } from "@/types";
import { NoDataFound } from "../no-data-found";
import { ProjectCard } from "../project/project-card";
import { Plus } from "lucide-react";

interface ProjectListProps {
  workspaceId: string;
  projects: Project[];

  onCreateProject: () => void;
}

export const ProjectList = ({
  workspaceId,
  projects,
  onCreateProject,
}: ProjectListProps) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
          <Plus className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-white">Maintenance Jobs</h3>
          <p className="text-slate-400 text-sm">
            Industrial maintenance projects and tasks
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-slate-700/30 rounded-lg border border-slate-600/50 p-8 text-center">
              <Plus className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <NoDataFound
                title="No maintenance jobs found"
                description="Create your first maintenance project to get started"
                buttonText="Create Job"
                buttonAction={onCreateProject}
              />
            </div>
          </div>
        ) : (
          projects.map((project) => {
            const projectProgress = 0;

            return (
              <ProjectCard
                key={project._id}
                project={project}
                progress={projectProgress}
                workspaceId={workspaceId}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
