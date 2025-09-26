import type { KeyTechnology, WorkOrProjectItem, WorkType } from '@/content/config'

import React, { useCallback, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { clsx } from "clsx";
import { getItemTextSummary } from "@/utils/work";



interface Props {
  entry: WorkOrProjectItem;
}

const CopyMarkdownButton: React.FC<Props> = ({ entry }) => {
  const [copied, setCopied] = useState(false);

  const markdownContent = useMemo(() => getItemTextSummary(entry), [entry]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);

      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = markdownContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [markdownContent]);

  const buttonCls = clsx(
    "inline-flex items-center justify-center w-8 h-8 m-2",
    "text-gray-600 dark:text-gray-400 hover:text-gray-700",
    "dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    "rounded-md transition-colors",
    "cursor-pointer"
  );

  return (
    <button
      id={`copy-btn-${entry.id}`}
      onClick={handleCopy}
      className={buttonCls}
      title="Copy as plain-text"
      type="button"
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
};

export default CopyMarkdownButton;