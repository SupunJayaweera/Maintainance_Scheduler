import type { CreateProjectFormData } from "@/components/project/create-project";
import { fetchData, postData, updateData } from "@/lib/fetch-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const UseCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      projectData: CreateProjectFormData;
      workspaceId: string;
    }) =>
      postData(
        `/projects/${data.workspaceId}/create-project`,
        data.projectData
      ),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.workspace],
      });
    },
  });
};

export const UseProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchData(`/projects/${projectId}/tasks`),
  });
};

export const useArchiveProjectMutation = () => {
  return useMutation({
    mutationFn: (projectId: string) =>
      updateData(`/projects/${projectId}/archive`, {}),
  });
};

export const useUpdateProjectStatusMutation = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      status,
    }: {
      projectId: string;
      status: string;
    }) => updateData(`/projects/${projectId}/status`, { status }),
  });
};

export const useGetArchivedProjectsQuery = () => {
  return useQuery({
    queryKey: ["projects", "archived"],
    queryFn: async () => fetchData("/projects/archived"),
  });
};
