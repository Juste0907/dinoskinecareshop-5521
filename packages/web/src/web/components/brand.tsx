import { Star } from "lucide-react";
import { cn } from "../lib/utils";

/** Row of solid stars + uppercase review proof, stamped in Mabry/Arial Black. */
export function ReviewStamp({
  text,
  tone = "concord",
  className,
}: {
  text: string;
  tone?: "white" | "concord";
  className?: string;
}) {
  const color = tone === "white" ? "text-white" : "text-concord";
  return (
    <div className={cn("flex items-center gap-2", color, className)}>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-current" strokeWidth={0} />
        ))}
      </div>
      <span className="font-stamp text-[15px] uppercase leading-[1.2] tracking-normal">{text}</span>
    </div>
  );
}

function scallopPath(size: number, bumps = 16, depth = 0.06) {
  const c = size / 2;
  const R = c * (1 - depth * 1.2);
  const pts: string[] = [];
  const steps = 240;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = R + c * depth * Math.cos(bumps * t);
    pts.push(`${(c + r * Math.cos(t)).toFixed(2)},${(c + r * Math.sin(t)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

const SEAL = scallopPath(100);

/** Scalloped nutritional-style claim seal. Square CSS box, illustrated silhouette. */
export function Seal({
  lines,
  tone = "concord",
  size = 104,
  className,
}: {
  lines: string[];
  tone?: "white" | "concord";
  size?: number;
  className?: string;
}) {
  const ink = tone === "white" ? "#ffffff" : "#3f0791";
  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d={SEAL} fill="none" stroke={ink} strokeWidth="2.4" />
        <circle cx="50" cy="50" r="36" fill="none" stroke={ink} strokeWidth="1" strokeDasharray="2 3" />
      </svg>
      <div
        className="relative text-center font-bold uppercase leading-[1.05]"
        style={{ color: ink, fontSize: size * 0.105 }}
      >
        {lines.map((l, i) => (
          <div key={i} className={i === 0 ? "text-[1.5em] leading-none font-black" : ""}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
