"use client";

//! Not used (prefer image-component.tsx)

import Image from "next/image";

const imageLoader = ({ src }: { src: string }) => {
  return `http://localhost:3000/api/image/${src}`;
};

export default function ImageComponentBlur({
  src,
  width,
  height,
  blurDataURL,
}: {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
}) {
  return (
    <Image
      loader={imageLoader}
      src={src}
      alt={src}
      width={width}
      height={height}
      className="rounded-lg shadow-lg"
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  );
}
