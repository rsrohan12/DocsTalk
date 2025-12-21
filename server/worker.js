import "dotenv/config";
import path from "path";
import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { redis } from "./lib/redis.js";
import 'dotenv/config';
import http from "http";

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    try {
      console.log("📄 Job received");

      // ✅ BullMQ already gives object
      const { pdfId, filePath } = job.data;

      if (!pdfId || !filePath) {
        throw new Error("pdfId or filePath missing in job data");
      }

      const resolvedPath = path.resolve(filePath);

      console.log("1️⃣ Loading PDF...");
      const loader = new PDFLoader(resolvedPath);
      const docs = await loader.load();
      console.log(`Pages loaded: ${docs.length}`);

      console.log("2️⃣ Splitting...");
      const splitter = new CharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
      });
      const splitDocs = await splitter.splitDocuments(docs);
      console.log(`Chunks created: ${splitDocs.length}`);

      // ✅ Attach pdfId to every chunk (CRITICAL)
      const docsWithMetadata = splitDocs.map((doc) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          pdfId, // 🔑 used for filtering later
        },
      }));
      
      console.log("3️⃣ Initializing Gemini embeddings...");
      const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
        apiKey: process.env.GEMINI_API_KEY,
      });

      console.log("4️⃣ Writing to Qdrant...");
      await QdrantVectorStore.fromDocuments(docsWithMetadata, embeddings, 
      {
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName: process.env.QDRANT_COLLECTION,
      });

      console.log(`✅ Vectors stored successfully for pdfId=${pdfId}`);
    } catch (err) {
      console.error("❌ Worker failed:", err);
      throw err; // important so BullMQ marks job as failed
    }
  },
  {
    connection: redis
  }
);

const PORT = process.env.PORT || 10000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Worker running");
}).listen(PORT, () => {
  console.log(`🟢 Dummy worker server listening on port ${PORT}`);
});

export default worker;
