import { CirclePlus, LayoutGrid } from "lucide-react";
import { Button } from "./ui/button";

interface NoDataFoundProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
}

export const NoDataFound = ({
  title,
  description,
  buttonText,
  buttonAction,
}: NoDataFoundProps) => {
  return (
    <div className="col-span-full text-center py-6 2xl:py-12">
      <LayoutGrid className="size-16 mx-auto text-slate-400 mb-4" />
      <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
        {description}
      </p>
      {buttonText && buttonAction && (
        <Button
          onClick={buttonAction}
          className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20"
        >
          <CirclePlus className="size-4 mr-2" />
          {buttonText}
        </Button>
      )}
    </div>
  );
};
