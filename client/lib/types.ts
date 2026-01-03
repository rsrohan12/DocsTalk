export interface Doc {
  pageContent: string;
  metadata: {
    source: string;
    pdf?: { totalPages: number };
    loc?: {
      pageNumber: number;
      lines?: { from: number; to: number };
    };
  };
  id: string;
}

export interface IMessage {
  role: "assistant" | "user";
  content?: string;
  documents?: Doc[];
}

export interface PdfItem {
  _id: string;
  originalName: string;
  pdfUrl: string;
}