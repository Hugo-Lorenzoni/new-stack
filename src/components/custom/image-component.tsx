"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, HTMLAttributes } from "react";

interface ImageComponentProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  width: number;
  height: number;
}

export default function ImageComponent({
  src,
  width,
  height,
  className,
  ...props
}: ImageComponentProps) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {isLoading && (
        <div className="absolute inset-0 -z-20 animate-pulse bg-zinc-200/50 dark:bg-zinc-800/50" />
      )}
      <Image
        loader={({ src }) =>
          `http://localhost:3000/api/image/${src}?thumbnail=true`
        }
        src={src}
        alt={src}
        width={width}
        height={height}
        className="absolute inset-0 -z-10"
        priority
      />
      <Image
        loader={({ src }) => `http://localhost:3000/api/image/${src}`}
        src={src}
        alt={src}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-500 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
