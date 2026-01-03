"use client";

import React, { useState, useEffect } from "react";
import { useClerkToken } from "@/hooks/useClerkToken";
import { API_BASE_URL } from "@/lib/config";
import { PDFPanelSkeleton } from "@/components/ui/pdfPanelSkeleton";
import { Sidebar } from "@/components/Sidebar";
import { PDFPanel } from "@/components/PdfPanel";
import { FileUploadSection } from "@/components/FileUpload";
import { ChatSection } from "@/components/ChatSection";
import { PdfItem } from "@/lib/types";
import { Menu } from "lucide-react";

export default function RAGPDFInterface() {
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [activePdf, setActivePdf] = useState<PdfItem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { getAuthToken } = useClerkToken();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await getAuthToken();

        // Load all PDFs
        const pdfsRes = await fetch(`${API_BASE_URL}/pdfs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pdfsData = await pdfsRes.json();
        setPdfs(pdfsData.pdfs || []);

        // Check if there's a pdfId in URL
        const params = new URLSearchParams(window.location.search);
        const pdfId = params.get("pdfId");

        if (pdfId) {
          // Restore active PDF
          const pdfRes = await fetch(`${API_BASE_URL}/pdfs/${pdfId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (pdfRes.ok) {
            const pdfData = await pdfRes.json();
            setActivePdf(pdfData.pdf);
          }
        }
      } catch (e) {
        console.error("Bootstrap failed", e);
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
  }, []);

  const clearSelectedPdf = () => {
    setActivePdf(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("pdfId");
    window.history.replaceState({}, "", url.pathname);
  };

  const handleDeletePdf = async (pdfId: string) => {
    try {
      const token = await getAuthToken();
      await fetch(`${API_BASE_URL}/del-pdf/${pdfId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update sidebar list
      setPdfs((prev) => prev.filter((p) => p._id !== pdfId));

      // If deleted PDF was active → clear it
      if (activePdf?._id === pdfId) {
        clearSelectedPdf();
      }
    } catch (error) {
      console.error("Failed to delete PDF", error);
    }
  };

  return (
    <div className="h-screen flex relative overflow-hidden bg-gray-100">
      {/* Sidebar toggle - Fixed position with proper z-index */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-2 left-6 z-30 bg-white p-3 cursor-pointer rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all border-2 border-gray-200 hover:border-blue-300"
        title="Open PDF Library"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pdfs={pdfs}
        activePdfId={activePdf?._id}
        onSelectPdf={(pdf) => {
          setActivePdf(pdf);
          window.history.pushState({}, "", `?pdfId=${pdf._id}`);
        }}
        onDeletePdf={handleDeletePdf}
        isLoading={initializing}
      />

      {/* Left Panel - PDF Viewer */}
      <div className="w-[45%] border-r-2 border-gray-200">
        {initializing ? (
          <PDFPanelSkeleton />
        ) : activePdf ? (
          <PDFPanel pdf={activePdf} onReplace={clearSelectedPdf} />
        ) : (
          <FileUploadSection
            onUploaded={(pdf) => {
              setPdfs((p) => [...p, pdf]);
              setActivePdf(pdf);
              window.history.pushState({}, "", `?pdfId=${pdf._id}`);
            }}
          />
        )}
      </div>

      {/* Right Panel - Chat */}
      <div className="w-[55%]">
        <ChatSection pdfId={activePdf?._id} initializing={initializing} />
      </div>
    </div>
  );
}