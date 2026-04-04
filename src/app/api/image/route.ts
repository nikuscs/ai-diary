import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { IMAGES_DIR } from "@/lib/config";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !/^[\w-]+$/.test(id)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const filePath = join(IMAGES_DIR, `${id}.png`);
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
