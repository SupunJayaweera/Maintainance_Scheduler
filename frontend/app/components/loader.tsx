import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin h-10 w-10" />
    </div>
  );
};
