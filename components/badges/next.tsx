import { Badge } from "../ui/badge";

export function NextBadge() {
  return (
    <Badge
      variant="outline"
      className="rounded-full border border-[#000000] bg-[#000000]/10 text-[#000000] dark:border-[#ffffff] dark:bg-[#ffffff]/10 dark:text-[#ffffff]"
    >
      Next.js
    </Badge>
  );
}
