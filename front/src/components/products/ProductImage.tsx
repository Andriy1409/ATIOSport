import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductImage({ imageUrl, alt, className }: { imageUrl: string | null; alt: string; className?: string }) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt={alt} className={cn("washed h-full w-full object-cover", className)} />
    );
  }

  return (
    <div className={cn("flex h-full w-full items-center justify-center bg-surface-hover text-muted-foreground", className)}>
      <ImageIcon strokeWidth={1.5} className="h-8 w-8" />
    </div>
  );
}
