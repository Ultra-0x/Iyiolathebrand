import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Material } from "./types";
import type { MaterialInput } from "./validate";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "materials.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const ALLOWED_IMAGES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};
const ALLOWED_VIDEOS: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

async function readAll(): Promise<Material[]> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf8")) as Material[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

// Writes run one at a time so concurrent admin actions can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();
function mutate<T>(fn: (items: Material[]) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const items = await readAll();
    const result = await fn(items);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2));
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export async function listMaterials(): Promise<Material[]> {
  return readAll();
}

export async function getMaterialById(id: string): Promise<Material | null> {
  const items = await readAll();
  return items.find((material) => material.id === id) ?? null;
}

export async function createMaterial(
  input: MaterialInput,
  image: string | null,
  video: string | null,
  images: string[] = [],
): Promise<Material> {
  return mutate((items) => {
    const material: Material = {
      id: randomUUID(),
      ...input,
      image,
      images,
      video,
      inStock: true,
      createdAt: new Date().toISOString(),
    };
    items.unshift(material);
    return material;
  });
}

export async function updateMaterial(
  id: string,
  input: MaterialInput,
  image?: string | null,
  video?: string | null,
  images?: string[],
): Promise<Material | null> {
  return mutate(async (items) => {
    const material = items.find((item) => item.id === id);
    if (!material) return null;

    const nextImage = image === undefined ? material.image : image;
    const nextVideo = video === undefined ? material.video : video;
    const nextImages = images === undefined ? material.images ?? [] : images;
    const previousFiles = [
      material.image,
      material.video,
      ...(material.images ?? []),
    ].filter((name): name is string => Boolean(name));
    const nextFiles = [nextImage, nextVideo, ...nextImages].filter((name): name is string => Boolean(name));

    for (const file of previousFiles) {
      if (!nextFiles.includes(file)) {
        await fs.rm(path.join(UPLOAD_DIR, file), { force: true });
      }
    }

    Object.assign(material, {
      ...input,
      image: nextImage,
      video: nextVideo,
      images: nextImages,
    });

    return material;
  });
}

export async function setStock(id: string, inStock: boolean): Promise<Material | null> {
  return mutate((items) => {
    const material = items.find((m) => m.id === id);
    if (!material) return null;
    material.inStock = inStock;
    return material;
  });
}

export async function deleteMaterial(id: string): Promise<boolean> {
  const removed = await mutate((items) => {
    const index = items.findIndex((m) => m.id === id);
    if (index === -1) return null;
    return items.splice(index, 1)[0];
  });
  if (!removed) return false;
  if (removed.image) await fs.rm(path.join(UPLOAD_DIR, removed.image), { force: true });
  if (removed.video) await fs.rm(path.join(UPLOAD_DIR, removed.video), { force: true });
  for (const file of removed.images ?? []) {
    await fs.rm(path.join(UPLOAD_DIR, file), { force: true });
  }
  return true;
}

/** Validates and stores an uploaded media file, returning its file name and media kind. */
export async function saveMedia(file: File): Promise<{ name: string; kind: "image" | "video" }> {
  const imageExt = ALLOWED_IMAGES[file.type];
  const videoExt = ALLOWED_VIDEOS[file.type];
  const ext = imageExt ?? videoExt;
  if (!ext) throw new Error("Upload a JPG, PNG, WebP, MP4, WebM or MOV file.");

  const maxBytes = imageExt ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    const limit = imageExt ? "5 MB" : "25 MB";
    const kindLabel = imageExt ? "Image" : "Video";
    throw new Error(`${kindLabel} must be ${limit} or smaller.`);
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomUUID()}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return { name, kind: imageExt ? "image" : "video" };
}
