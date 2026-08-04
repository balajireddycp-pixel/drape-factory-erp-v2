import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export function Avatar({ name, src, className, size = 36 }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-medium",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name) || "?"}</span>
      )}
    </div>
  );
}
