import { HeadlineCopy } from "@/components/headline-copy";

export default function HomePage() {
  return (
    <main>
      <div className="px-4 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-4">
            <HeadlineCopy />
          </div>
        </div>
      </div>
    </main>
  );
}
