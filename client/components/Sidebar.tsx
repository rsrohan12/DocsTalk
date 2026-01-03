"use client"

import { PdfItem } from "@/lib/types";
import { SidebarSkeleton } from "./ui/sidebarSkeleton";
import { FileText, Trash2, X } from "lucide-react";

export const Sidebar = ({
  isOpen,
  onClose,
  pdfs,
  onSelectPdf,
  activePdfId,
  onDeletePdf,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  pdfs: PdfItem[];
  onSelectPdf: (pdf: PdfItem) => void;
  activePdfId?: string;
  onDeletePdf: (pdfId: string) => void;
  isLoading?: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-linear-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Your PDFs</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isLoading ? "Loading..." : `${pdfs.length} document${pdfs.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 cursor-pointer rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* PDF List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <SidebarSkeleton />
          ) : pdfs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
              <FileText className="w-16 h-16 mb-3 opacity-30" />
              <p className="text-sm font-medium">No PDFs uploaded yet</p>
              <p className="text-xs mt-1">Upload one to get started</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {pdfs.map((pdf) => (
                <button
                  key={pdf._id}
                  onClick={() => {
                    onSelectPdf(pdf);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl cursor-pointer border-2 transition-all group ${
                    activePdfId === pdf._id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Left icon */}
                    <div
                      className={`p-2 rounded-lg ${
                        activePdfId === pdf._id
                          ? "bg-blue-100"
                          : "bg-gray-100 group-hover:bg-blue-100"
                      }`}
                    >
                      <FileText
                        className={`w-5 h-5 ${
                          activePdfId === pdf._id
                            ? "text-blue-600"
                            : "text-gray-500 group-hover:text-blue-600"
                        }`}
                      />
                    </div>

                    {/* Filename */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          activePdfId === pdf._id
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {pdf.originalName}
                      </p>
                      {activePdfId === pdf._id && (
                        <p className="text-xs text-blue-600 mt-0.5">Active</p>
                      )}
                    </div>

                    {/* Delete icon */}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePdf(pdf._id);
                      }}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

