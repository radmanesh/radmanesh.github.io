// app/components/banners/free-palestine.tsx
export function FreePalestineBanner() {
  return (
    <div className="top-2 z-50 w-full max-w-3xl mx-auto items-center mb-1">
      <div className="bg-zinc-50/75 dark:bg-zinc-900/75 text-foreground px-4 py-2">
        <div className="max-w-(--breakpoint-xl) mx-auto text-center font-bold">
          Free Palestine
        </div>
      </div>
      <div
        className="h-1 w-full"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(238, 42, 53) 0%, rgb(238, 42, 53) 25%, rgb(0, 0, 0) 25%, rgb(0, 0, 0) 50%, rgb(255, 255, 255) 50%, rgb(255, 255, 255) 75%, rgb(0, 151, 54) 75%, rgb(0, 151, 54) 100%)",
        }}
      />
    </div>
  );
}
