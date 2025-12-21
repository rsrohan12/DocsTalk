import fetch from "node-fetch";

export async function ensureQdrantIndex() {
  try {
    const res = await fetch(
      `${process.env.QDRANT_URL}/collections/${process.env.QDRANT_COLLECTION}/index`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.QDRANT_API_KEY,
        },
        body: JSON.stringify({
          field_name: "metadata.pdfId",
          field_schema: "keyword",
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.log("⚠️ Qdrant index response:", text);
    } else {
      console.log("✅ Qdrant index ensured for metadata.pdfId");
    }
  } catch (err) {
    console.error("❌ Failed to ensure Qdrant index", err);
  }
}
