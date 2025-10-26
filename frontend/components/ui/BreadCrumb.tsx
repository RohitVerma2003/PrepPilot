import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <span className="text-blue-500 hover:underline cursor-pointer">
              {item.label}
            </span>
          ) : (
            <span className={item.active ? "text-blue-500" : ""}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}