// route hendler for images
import { NextResponse } from "next/server";
import s3Client from "@/lib/s3";
import { tryCatch } from "@/lib/try-catch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return NextResponse.json(
      { error: "File name is required" },
      { status: 400 }
    );
  }

  const { data, error } = await tryCatch(
    s3Client.getObject(process.env.MINIO_BUCKET_NAME, fileName)
  );

  if (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
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
