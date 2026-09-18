import clsx from "@/lib/clsx";

// Loading-state primitives built on Tailwind's built-in `animate-pulse`
// utility (pure CSS, no animation library) — colors match the k08Qt
// Loading/Skeleton node in design.pen.

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={clsx("animate-pulse rounded-[6px] bg-[#ECE7EF]", className ?? "h-3 w-full")}
    />
  );
}

export function SkeletonCircle({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-full bg-[#ECE7EF]", className ?? "h-8 w-8")} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={clsx("rounded-card border border-bone bg-[#F2EDF4] p-6", className)}>
      <SkeletonLine className="h-3 w-1/3" />
      <SkeletonLine className="mt-3 h-6 w-2/3" />
      <SkeletonLine className="mt-2 h-3 w-1/4" />
    </div>
  );
}

export function SkeletonRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 border-t border-bone py-3">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonLine key={i} className={clsx("h-3", i === 0 ? "w-1/4" : "flex-1")} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} columns={columns} />
      ))}
    </div>
  );
}

export function SkeletonStatGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-card border border-bone bg-white p-5">
          <SkeletonLine className="h-2.5 w-1/2 bg-[#F2EDF4]" />
          <SkeletonLine className="mt-3 h-5 w-2/3" />
        </div>
      ))}
    </div>
  );
}
