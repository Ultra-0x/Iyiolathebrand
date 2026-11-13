import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteMaterial, getMaterialById, saveMedia, setStock, updateMaterial } from "@/lib/store";
import { parseMaterialForm } from "@/lib/validate";

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!isAdmin()) return NextResponse.json({ error: "Sign in as admin first." }, { status: 401 });

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await req.json().catch(() => null)) as { inStock?: unknown } | null;
    if (typeof body?.inStock !== "boolean") {
      return NextResponse.json({ error: "inStock must be true or false." }, { status: 400 });
    }
    const material = await setStock(params.id, body.inStock);
    if (!material) return NextResponse.json({ error: "Material not found." }, { status: 404 });
    return NextResponse.json(material);
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form payload." }, { status: 400 });

  const parsed = parseMaterialForm(form);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const current = await getMaterialById(params.id);
  if (!current) return NextResponse.json({ error: "Material not found." }, { status: 404 });

  const files = form.getAll("media").filter((file): file is File => file instanceof File && file.size > 0);
  let image: string | null | undefined = undefined;
  let video: string | null | undefined = undefined;
  let images: string[] | undefined = undefined;

  if (files.length > 0) {
    const nextImages: string[] = [];
    let nextImage: string | null = null;
    let nextVideo: string | null = null;

    for (const file of files) {
      try {
        const result = await saveMedia(file);
        if (result.kind === "image") {
          nextImages.push(result.name);
          if (!nextImage) nextImage = result.name;
        } else if (!nextVideo) {
          nextVideo = result.name;
        }
      } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 400 });
      }
    }

    image = nextImage;
    video = nextVideo;
    images = nextImages;
  }

  const material = await updateMaterial(params.id, parsed.data, image, video, images);
  if (!material) return NextResponse.json({ error: "Material not found." }, { status: 404 });
  return NextResponse.json(material);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!isAdmin()) return NextResponse.json({ error: "Sign in as admin first." }, { status: 401 });
  const removed = await deleteMaterial(params.id);
  if (!removed) return NextResponse.json({ error: "Material not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
