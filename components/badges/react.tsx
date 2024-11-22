import { Badge } from "../ui/badge";

export function ReactBadge() {
  return (
    <Badge
      variant="outline"
      className="rounded-full border border-[#61DAFB] bg-[#61DAFB]/10 text-[#61DAFB] selection:text-[#61DAFB]/80"
    >
      React
    </Badge>
  );
}
