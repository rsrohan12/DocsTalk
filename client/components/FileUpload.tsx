"use client"

import { useClerkToken } from "@/hooks/useClerkToken";
import { API_BASE_URL } from "@/lib/config";
import { PdfItem } from "@/lib/types";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { useState } from "react";

export const FileUploadSection = ({
  onUploaded,
}: {
  onUploaded: (pdf: PdfItem) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const { getAuthToken } = useClerkToken();

  const handleUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";

    const token = await getAuthToken();

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploading(true);
      const formData = new FormData();
      formData.append("pdf", file);

      try {
        const res = await fetch(`${API_BASE_URL}/upload/pdf`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();

        onUploaded({
          _id: data.pdfId,
          originalName: data.originalName,
          pdfUrl: data.pdfUrl,
        });
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            RAG PDF Assistant
          </h1>
          <p className="text-gray-600">
            Upload a PDF document and start asking questions
          </p>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full border-4 cursor-pointer border-dashed border-gray-300 rounded-2xl p-16 hover:border-blue-500 hover:bg-blue-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
              <p className="text-sm font-medium text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-600 mb-3 transition-colors" />
              <p className="text-lg font-semibold text-gray-700 mb-1">
                Upload PDF File
              </p>
              <p className="text-sm text-gray-500">
                Click to browse your files
              </p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};