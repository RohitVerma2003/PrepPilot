import { XCircle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
}

export default function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="border border-red-800 bg-red-950 rounded-md p-4">
      <div className="flex gap-3">
        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div className="text-sm text-red-200">
          <strong className="text-red-100">Error:</strong> {message}
        </div>
      </div>
    </div>
  );
}
