import type { KeyTechnology, KeyTechnologyType } from '@/content/config'

import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from 'clsx';


const getTechColors = (type: KeyTechnologyType = "other") => {
  switch (type) {
    case "language_tech":
      return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "framework_tooling":
      return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
    case "infra_platform":
      return "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400";
    case "engineering_practice":
      return "text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400";
    case "architecture_pattern":
      return "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400";
    case "system_capability":
      return "text-rose-600 bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400";
    case "delivery_context":
      return "text-slate-600 bg-slate-100 dark:bg-slate-900/20 dark:text-slate-400";
    default:
      return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
      // return workType === "employment"
      //   ? "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
      //   : "text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400";
  }
};

export interface Props {
  tech: KeyTechnology;
  popupEnabled: boolean;
}

const TechBadge: React.FC<Props> = ({ tech, popupEnabled }) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const colorClasses = useMemo(() => getTechColors(tech.type), [tech.type]);

  const usePopup = popupEnabled && tech.description !== ""

  return (
    <div ref={badgeRef} className="relative group tech-badge">
      <span
        className={clsx(
          "inline-flex flex-wrap px-3 py-1 text-xs font-medium rounded-full cursor-default",
          colorClasses,
        )}
      >
        {tech.name}
      </span>

      {usePopup && (
        <div
          className={clsx(
            "absolute bottom-full left-1/2 -translate-x-1/2 transform mb-2 px-3 py-2",
            "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg",
            "pointer-events-none z-10 w-80 tech-tooltip",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          )}
          role="tooltip"
        >
          <div className="text-center leading-relaxed">
            {tech.description}
          </div>

          {/* Tooltip triangle connector */}
          <div
            className={clsx(
              "absolute top-full left-1/2 -translate-x-1/2 transform w-0 h-0",
              "border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100",
            )} />
        </div>
      )}
    </div>
  );
};

export default TechBadge;