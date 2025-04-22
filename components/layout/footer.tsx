export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-3xl mt-8 border-t px-2 h-16">
      <div className="flex justify-between items-center mt-4 font-mono font-medium text-xs md:text-sm leading-relaxed tracking-tight">
        <span></span>
        <span>Radmanesh - {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
