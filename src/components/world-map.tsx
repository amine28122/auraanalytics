'use client';
import { cn } from "@/lib/utils";
import World from "react-world-flags";

export function WorldMap({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full h-full", className)}>
        <World
          className="dark:grayscale dark:brightness-50"
          style={{ width: '100%', height: 'auto' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
    </div>
  );
}
