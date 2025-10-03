"use client";

import { Highlight, type PrismTheme } from "prism-react-renderer";
import React, { useState } from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

const customTheme: PrismTheme = {
  plain: {
    color: "var(--code-text)",
    backgroundColor: "var(--code-bg)",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "var(--code-comment)",
        fontStyle: "italic" as const,
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "var(--code-punctuation)",
      },
    },
    {
      types: ["property", "boolean", "number", "constant", "symbol", "deleted"],
      style: {
        color: "var(--code-number)",
      },
    },
    {
      types: ["tag", "selector"],
      style: {
        color: "var(--code-tag)",
      },
    },
    {
      types: ["attr-name", "string", "char", "builtin", "inserted"],
      style: {
        color: "var(--code-string)",
      },
    },
    {
      types: ["operator", "entity", "url"],
      style: {
        color: "var(--code-operator)",
      },
    },
    {
      types: ["atrule", "attr-value", "keyword"],
      style: {
        color: "var(--code-keyword)",
      },
    },
    {
      types: ["function"],
      style: {
        color: "var(--code-function)",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "var(--code-class)",
      },
    },
    {
      types: ["regex", "important", "variable"],
      style: {
        color: "var(--code-variable)",
      },
    },
  ],
};

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const language = (className?.replace(/language-/, "") || "text") as any;

  // Map some language aliases to proper language names supported by prism-react-renderer
  const languageMap: Record<string, string> = {
    csharp: "csharp",
    cs: "csharp",
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    jsx: "jsx",
    tsx: "tsx",
    python: "python",
    py: "python",
    sql: "sql",
    bash: "bash",
    sh: "bash",
    shell: "bash",
    json: "json",
    css: "css",
    markup: "markup",
    html: "markup",
    xml: "markup",
  };

  const mappedLanguage = languageMap[language] || "javascript"; // Default to javascript for better highlighting

  // Get the code content as string
  const getCodeString = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return node.toString();
    if (React.isValidElement(node) && (node.props as any)?.children) {
      return getCodeString((node.props as any).children);
    }
    if (Array.isArray(node)) {
      return node.map(getCodeString).join("");
    }
    return "";
  };

  const code = getCodeString(children).trim();
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };
  
  return (
    <div className="my-6 rounded-lg max-w-full relative group border border-gray-200 dark:border-gray-700 shadow-sm">
      <button
        onClick={copyToClipboard}
        className="absolute top-2.5 right-2.5 p-1.5 rounded bg-white dark:bg-gray-800 flex-shrink-0 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 z-10 shadow-sm border border-gray-200 dark:border-gray-600"
        aria-label="Copy code to clipboard"
        title={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      <Highlight theme={customTheme} code={code} language={mappedLanguage}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} mobile-code-block`}
            style={{
              ...style,
              margin: 0,
              fontFamily:
                '"Cartograph CF", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
            data-lang={mappedLanguage}
          >
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({ line })}
                className="codeblock-line"
              >
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
