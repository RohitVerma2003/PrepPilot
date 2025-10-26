import { Circle } from "lucide-react";

interface InfoBoxProps {
  children: React.ReactNode;
  variant?: "info" | "error" | "warning";
}

export default function InfoBox({ children, variant = "info" }: InfoBoxProps) {
  const variantClasses = {
    info: "border-blue-800 bg-blue-950 text-blue-200",
    error: "border-red-800 bg-red-950 text-red-200",
    warning: "border-yellow-800 bg-yellow-950 text-yellow-200",
  };

  const iconColor = {
    info: "text-blue-500",
    error: "text-red-500",
    warning: "text-yellow-500",
  };

  return (
    <div className={`border rounded-md p-4 ${variantClasses[variant]}`}>
      <div className="flex gap-3">
        <Circle
          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor[variant]}`}
        />
        <div className="text-xs">{children}</div>
      </div>
    </div>
  );
}
