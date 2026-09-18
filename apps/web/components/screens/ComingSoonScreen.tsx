import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Card from "@/components/ui/Card";

export default function ComingSoonScreen({
  icon,
  title,
  description,
}: {
  icon: IconSvgElement;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[480px] items-center justify-center">
      <Card className="flex max-w-sm flex-col items-center gap-3 px-10 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-magenta-tint text-magenta-deep">
          <HugeiconsIcon icon={icon} className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="text-subheading font-[485] text-ink">{title}</p>
        <p className="text-body-sm text-steel">{description}</p>
      </Card>
    </div>
  );
}
