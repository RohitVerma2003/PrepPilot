import React from "react";

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Card({ title, icon, children }: CardProps) {
  return (
    <div className="border border-gray-800 rounded-lg bg-gray-900">
      <div className="border-b border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-semibold">{title}</h2>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
