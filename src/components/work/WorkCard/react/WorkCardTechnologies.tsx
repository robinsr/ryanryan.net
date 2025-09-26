import type { KeyTechnology, WorkOrProjectItem, WorkType } from '@/content/config'

import React, { useMemo, useState } from 'react';
import TechnologyBadge from './TechnologyBadge'; // your TSX-converted badge
import { getItemId } from '@/utils/work';



//
// TechnologyPills - The inline/collapsed row of key tech items
//

interface TechnologyPillsProps {
  items: KeyTechnology[];
}

const TechnologyPills: React.FC<TechnologyPillsProps> = ({ items }) => {
  return (
    <>
      {items.map((tech, index) => (
        <div className="tech-item" key={tech.name}>
          <TechnologyBadge tech={tech} popupEnabled={true} />
        </div>
      ))}
    </>
  );
}

//
// TechnologyTable - The expanded table view of key tech items with descriptions
//

interface TechnologyTableProps {
  items: KeyTechnology[];
}

const TechnologyTable: React.FC<TechnologyTableProps> = ({ items }) => {
  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table className="w-full border-collapse text-sm min-w-full">
        <thead>
          <tr className="border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
              Technology
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
              How I used it
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((tech, index) => (
            <tr
              key={`tech-row-${index}`}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="py-3 px-4 align-top whitespace-nowrap">
                <div id={`tech-item-${index}`} className="tech-item">
                  <TechnologyBadge tech={tech} popupEnabled={false} />
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {typeof tech === "string" ? "" : tech.description ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

//
// TechnologiesSection - The main component that toggles between pills and table
//

interface TechSectionProps {
  entry: WorkOrProjectItem;
}

const TechnologiesSection: React.FC<TechSectionProps> = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);

  const technologies = useMemo(() => entry.technologies ?? [], []);

  const entryId = getItemId(entry);

  if (!technologies.length) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Technologies</h4>
        <button
          id={`expand-tech`}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
          data-expanded={expanded ? "true" : "false"}
          onClick={() => setExpanded((e) => !e)}
          type="button"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div
        id={`tech-container`}
        className={
          expanded
            ? "flex-col transition-all duration-300"
            : "flex flex-wrap gap-2 transition-all duration-300"
        }
      >
        {!expanded ? (
          // Collapsed: flex badges
          <TechnologyPills items={technologies} />
        ) : (
          // Expanded: table view (with tooltips auto-disabled by `flex-col` on the container)
          <TechnologyTable items={technologies} />
        )}
      </div>
    </div>
  );
};

export default TechnologiesSection;