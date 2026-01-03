"use client"

import { Doc } from "@/lib/types";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useState } from "react";

export const SourceDocument = ({ doc, index }: { doc: Doc; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-2 border-gray-200 rounded-xl bg-white overflow-hidden hover:border-blue-300 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">
              Source {index + 1}
            </p>
            <p className="text-xs text-gray-500">
              Page {doc.metadata.loc?.pageNumber || "N/A"}
              {doc.metadata.loc?.lines && (
                <span className="ml-2">
                  Lines {doc.metadata.loc.lines.from}-
                  {doc.metadata.loc.lines.to}
                </span>
              )}
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t-2 border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {doc.pageContent}
          </p>
        </div>
      )}
    </div>
  );
};