import { GitBranch } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <GitBranch className="w-8 h-8 text-gray-100" />
          <h1 className="text-2xl font-semibold font-mono">PrepPilot</h1>
          <span className="px-2 py-0.5 text-xs font-medium bg-green-600 text-white rounded-full">
            v1.0
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
