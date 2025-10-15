import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const BackButton = ({
  onClick,
  label = "Back",
  className = "",
}: BackButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-gray-900 hover:bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg border border-gray-200 transition-all duration-200 font-medium ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};
