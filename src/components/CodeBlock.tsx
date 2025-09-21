"use client";

import { Highlight, type PrismTheme } from "prism-react-renderer";
import React from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

// Custom theme based on Night Owl colors
const customTheme: PrismTheme = {
  plain: {
    color: "#d6deeb",
    backgroundColor: "#011627",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#637777",
        fontStyle: "italic" as const,
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "#d6deeb",
      },
    },
    {
      types: [
        "property",
        "tag",
        "boolean",
        "number",
        "constant",
        "symbol",
        "deleted",
      ],
      style: {
        color: "#7fdbca",
      },
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin", "inserted"],
      style: {
        color: "#ecc48d",
      },
    },
    {
      types: ["operator", "entity", "url"],
      style: {
        color: "#f78c6c",
      },
    },
    {
      types: ["atrule", "attr-value", "keyword"],
      style: {
        color: "#c792ea",
      },
    },
    {
      types: ["function", "class-name"],
      style: {
        color: "#82aaff",
      },
    },
    {
      types: ["regex", "important", "variable"],
      style: {
        color: "#f78c6c",
      },
    },
  ],
};

export default function CodeBlock({ children, className }: CodeBlockProps) {
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

  return (
    <div className="my-6 rounded-lg overflow-hidden">
      <Highlight theme={customTheme} code={code} language={mappedLanguage}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className}
            style={{
              ...style,
              margin: 0,
              padding: "1rem",
              fontSize: "14px",
              lineHeight: "1.5",
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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
