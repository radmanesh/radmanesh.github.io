import Image from "next/image";
import { format } from "date-fns";
import { ComponentProps } from "react";

import { SectionItem } from "som3aware";

// --------- COMPONENT PROPS ---------
interface SectionCardProps extends ComponentProps<"div"> {
  item: SectionItem;
}

// --------- COMPONENT LAYOUT ---------
export function SectionCard({ item, ...props }: SectionCardProps) {
  return (
    <div
      {...props}
      className="rounded-lg border text-card-foreground relative overflow-hidden transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-400"
    >
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 mr-4">
          <Image
            width={48}
            height={48}
            src={`/about/${item.image}`}
            alt={`${item.entity}'s logo`}
            className="rounded-full border border-border"
          />
        </div>
        <div className="flex-grow min-w-0 tracking-tight font-normal">
          <p className="text-xs text-muted-foreground/80 uppercase">{`${format(
            item.startDate,
            "LLL, yyyy"
          )} • ${
            item.endDate !== "present"
              ? format(item.endDate, "LLL, yyyy")
              : "present"
          }`}</p>
          <h2 className="font-bold truncate leading-relaxed">{item.entity}</h2>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
