import { scan } from "@/lib/scanner";
import { getConfig } from "@/lib/db/queries";
import { DEFAULT_SCAN_CONFIG } from "@/lib/config";

export async function POST() {
  const scanConfig = await getConfig("scan", DEFAULT_SCAN_CONFIG);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await scan({
          limit: scanConfig.limit,
          maxAgeDays: scanConfig.maxAgeDays,
          onProgress: (progress) => {
            controller.enqueue(
              encoder.encode(JSON.stringify({ type: "progress", ...progress }) + "\n")
            );
          },
        });
        controller.enqueue(
          encoder.encode(JSON.stringify({ type: "done", ...result }) + "\n")
        );
      } catch (error) {
        controller.enqueue(
          encoder.encode(JSON.stringify({ type: "error", error: String(error) }) + "\n")
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
