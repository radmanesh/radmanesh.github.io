"use client";

import { useTheme } from "next-themes";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createHighlighter,
  BundledLanguage,
  BundledTheme,
} from "shiki/bundle/web";

import { Button } from "@/components/ui/button";

// --------- PROPS --------- //
interface CodeBlockProps {
  code: string;
  lang: BundledLanguage;
}

// --------- COMPONENT --------- //
export function CodeBlock({ code, lang }: CodeBlockProps) {
  const { theme } = useTheme();
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const highlight = async () => {
      const highlighter = await createHighlighter({
        themes: ["github-light", "poimandres"],
        langs: [lang],
      });

      const currentTheme = theme === "dark" ? "poimandres" : "github-light";
      const html = highlighter.codeToHtml(code, {
        lang: lang,
        theme: currentTheme as BundledTheme,
      });

      setHtml(html);
    };

    highlight();
  }, [code, lang, theme]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg">
      <Button
        size="icon"
        variant="outline"
        onClick={copyToClipboard}
        className="absolute right-2 top-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/80"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Copy className="h-4 w-4 text-gray-300" />
        )}
      </Button>
      <div
        className="overflow-hidden max-w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
