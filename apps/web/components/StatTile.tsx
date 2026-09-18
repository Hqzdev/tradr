import clsx from "@/lib/clsx";
import Card from "@/components/ui/Card";

export default function StatTile({
  label,
  value,
  caption,
  tone = "default",
}: {
  label: string;
  value: string;
  caption?: string;
  tone?: "default" | "positive";
}) {
  return (
    <Card
      className={clsx(
        "px-5 py-4",
        tone === "positive" && "border-positive/15 bg-positive-tint/40"
      )}
    >
      <p className="text-body-sm text-steel">{label}</p>
      <p
        className={clsx(
          "mt-1.5 text-heading-sm font-[485] tabular-nums",
          tone === "positive" ? "text-positive" : "text-ink"
        )}
      >
        {value}
      </p>
      {caption && <p className="mt-1 text-caption text-steel">{caption}</p>}
    </Card>
  );
}
