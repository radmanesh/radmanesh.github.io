import { ReactNode } from "react";

// --------- COMPONENT LAYOUT ---------
export function MaxWidthWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 md:px-6">
      <div className="mx-auto max-w-3xl w-full">{children}</div>
    </div>
  );
}
