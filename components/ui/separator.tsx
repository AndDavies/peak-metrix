export function Separator({ orientation = "horizontal", className }: { orientation?: "horizontal" | "vertical"; className?: string }) {
    return (
      <div
        className={`${
          orientation === "vertical" ? "w-px h-full" : "h-px w-full"
        } bg-gray-800 ${className}`}
      />
    );
  }