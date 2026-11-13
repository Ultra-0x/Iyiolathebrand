import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createMaterial, listMaterials, saveMedia } from "@/lib/store";
import { parseMaterialForm } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listMaterials());
}

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Sign in as admin first." }, { status: 401 });

  const form = await req.formData();
  const parsed = parseMaterialForm(form);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  let image: string | null = null;
  let video: string | null = null;
  const files = form.getAll("media").filter((file): file is File => file instanceof File && file.size > 0);
  const images: string[] = [];

  for (const file of files) {
    try {
      const result = await saveMedia(file);
      if (result.kind === "image") {
        images.push(result.name);
        if (!image) image = result.name;
      } else if (!video) {
        video = result.name;
      }
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
  }

  const material = await createMaterial(parsed.data, image, video, images);
  return NextResponse.json(material, { status: 201 });
}
