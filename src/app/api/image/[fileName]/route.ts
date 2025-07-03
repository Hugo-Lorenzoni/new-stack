// route hendler for images
import { NextRequest, NextResponse } from "next/server";
import s3Client from "@/lib/s3";
import { tryCatch } from "@/lib/try-catch";
import { streamToBuffer } from "@/lib/stream";
import sharp from "sharp";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> },
) {
  const { fileName } = await params;

  if (!fileName) {
    return NextResponse.json(
      { error: "File name is required" },
      { status: 400 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const isThumbnail = searchParams.get("thumbnail") === "true";

  const { data, error } = await tryCatch(
    s3Client.getObject(process.env.MINIO_BUCKET_NAME, fileName),
  );

  if (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // If the request is for a thumbnail, we can process the image here
  if (isThumbnail) {
    const imageBuffer = await streamToBuffer(data);
    const blurBuffer = await sharp(imageBuffer).blur(1).resize(50).toBuffer();

    // log the size in bytes of the blurBuffer and the % difference
    console.log(
      `Blurred image size: ${blurBuffer.length} bytes (original: ${imageBuffer.length} bytes) > ${(
        (blurBuffer.length / imageBuffer.length) *
        100
      ).toFixed(2)}% of original size`,
    );

    const thumbnailStream = new ReadableStream({
      async pull(controller) {
        controller.enqueue(blurBuffer);
        controller.close();
      },
    });

    return new NextResponse(thumbnailStream);
  }

  const stream = new ReadableStream({
    async pull(controller) {
      for await (const chunk of data) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });

  return new NextResponse(stream);
}
