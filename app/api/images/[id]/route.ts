import { Readable } from "node:stream";
import { ObjectId } from "mongodb";
import { getPostersBucket } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteContext<"/api/images/[id]">) {
  const { id } = await context.params;
  if (!ObjectId.isValid(id)) return new Response("Not found", { status: 404 });

  const bucket = await getPostersBucket();
  const objectId = new ObjectId(id);
  const file = await bucket.find({ _id: objectId }).next();
  if (!file) return new Response("Not found", { status: 404 });

  const stream = bucket.openDownloadStream(objectId);
  const webStream = Readable.toWeb(stream) as ReadableStream<Uint8Array>;
  const metadata = file.metadata as { contentType?: string } | undefined;

  return new Response(webStream, {
    headers: {
      "Content-Type": metadata?.contentType ?? "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${file.filename}"`,
    },
  });
}
