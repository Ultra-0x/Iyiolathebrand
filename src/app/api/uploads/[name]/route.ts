import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { UPLOAD_DIR } from "@/lib/store";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(_req: Request, { params }: { params: { name: string } }) {
  // Only serve files we generated ourselves: <uuid>.<ext>. Blocks path traversal.
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp|mp4|webm|mov)$/.test(params.name)) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, params.name));
    return new NextResponse(data, {
      headers: {
        "Content-Type": TYPES[path.extname(params.name)],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
