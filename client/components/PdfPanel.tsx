"use client"

import { PdfItem } from "@/lib/types";
import { FileText, RotateCcw } from "lucide-react";

export const PDFPanel = ({
  pdf,
  onReplace,
}: {
  pdf: PdfItem;
  onReplace: () => void;
}) => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="border-b-2 px-6 py-4 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-3 min-w-0 flex-1 ml-8">
          <div className="p-2 bg-blue-100 rounded-lg ml-8">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">
              {pdf.originalName}
            </p>
            <p className="text-xs text-gray-500">PDF Document</p>
          </div>
        </div>
        <button
          onClick={onReplace}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Replace</span>
        </button>
      </div>

      <div className="flex-1 bg-gray-100 p-2">
        <iframe
          src={pdf.pdfUrl}
          className="w-full h-full rounded-lg shadow-inner"
          title="PDF Preview"
        />
      </div>
    </div>
  );
};