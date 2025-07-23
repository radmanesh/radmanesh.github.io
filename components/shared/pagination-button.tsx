import Link from "next/link";

import { Button } from "@/components/ui/button";

// --------- COMPONENT PROPS ---------
interface PaginationButtonProps {
  hasMore: boolean;
  currentPage: number;
  baseHref?: string;
}

// --------- COMPONENT LAYOUT ---------
export function PaginationButton({
  hasMore,
  currentPage,
  baseHref = "/projects",
}: PaginationButtonProps) {
  return (
    <Button variant="default" asChild className="text-center">
      <Link
        href={
          !hasMore
            ? `${baseHref}?page=1`
            : `${baseHref}?page=${currentPage + 1}`
        }
      >
        {!hasMore ? "Show less" : "Show more"}
      </Link>
    </Button>
  );
}
