import { useQuery } from "@tanstack/react-query";
import { Loader } from "../loader";
import type { ActivityLog } from "@/types";
import { fetchData } from "@/lib/fetch-utils";
import { getActivityIcon } from "./task-icon";

export const TaskActivity = ({ resourceId }: { resourceId: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ["task-activity", resourceId],
    queryFn: () => fetchData(`/tasks/${resourceId}/activity`),
  }) as {
    data: ActivityLog[];
    isPending: boolean;
  };

  if (isPending) return <Loader />;

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg text-white mb-4">Task Activity Log</h3>

      <div className="space-y-4">
        {data?.length > 0 ? (
          data.map((activity) => (
            <div key={activity._id} className="flex gap-3">
              <div className="size-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                {getActivityIcon(activity.action)}
              </div>

              <div className="flex-1">
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">
                    {activity.user.name}
                  </span>{" "}
                  {activity.details?.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400 text-center py-4">
            No maintenance activities recorded
          </p>
        )}
      </div>
    </div>
  );
};
