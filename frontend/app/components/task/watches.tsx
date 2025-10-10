import type { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Watchers = ({ watchers }: { watchers: User[] }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 shadow-sm mb-6">
      <h3 className="text-lg font-medium mb-4 text-white">Team Observers</h3>

      <div className="space-y-2">
        {watchers && watchers.length > 0 ? (
          watchers.map((watcher) => (
            <div key={watcher._id} className="flex items-center gap-2">
              <Avatar className="size-6 bg-slate-600 border border-slate-500">
                <AvatarImage src={watcher.profilePicture} />
                <AvatarFallback className="text-white text-xs">
                  {watcher.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <p className="text-sm text-slate-300">{watcher.name}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No team observers</p>
        )}
      </div>
    </div>
  );
};
