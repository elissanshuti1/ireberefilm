import { ObjectId } from "mongodb";
import { Readable } from "node:stream";
import { getPostersBucket } from "@/lib/db";

const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/svg+xml", "svg"],
  ["image/gif", "gif"],
]);

export async function uploadPoster(file: File) {
  if (!file.size) throw new Error("Hitamo image y'filime");
  if (file.size > 4 * 1024 * 1024) throw new Error("Image ntigomba kurenza 4MB");
  const extension = allowedTypes.get(file.type);
  if (!extension) throw new Error("Hitamo PNG, JPG, WEBP, SVG cyangwa GIF");

  const bucket = await getPostersBucket();
  const filename = `poster-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  return new Promise<string>((resolve, reject) => {
    const upload = bucket.openUploadStream(filename, {
      metadata: { contentType: file.type, uploadedAt: new Date().toISOString() },
    });
    stream.pipe(upload);
    upload.on("finish", () => resolve(upload.id.toHexString()));
    upload.on("error", reject);
    stream.on("error", reject);
  });
}

export async function deletePoster(id?: string | null) {
  if (!id || !ObjectId.isValid(id)) return;
  const bucket = await getPostersBucket();
  await bucket.delete(new ObjectId(id));
}
