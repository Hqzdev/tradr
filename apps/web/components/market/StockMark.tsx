import Image from "next/image";
import type { StockProfile } from "@/lib/stocks";

export default function StockMark({ stock, size = 48 }: { stock: StockProfile; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-white/10"
      style={{ width: size, height: size, background: stock.color }}
    >
      <Image
        src={stock.logoSrc}
        alt={`${stock.name} logo`}
        width={size}
        height={size}
        unoptimized
        className="h-[56%] w-[56%] object-contain"
      />
    </span>
  );
}
