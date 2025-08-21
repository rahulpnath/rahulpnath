"use client";

import { MDXProvider } from "@mdx-js/react";

const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold my-4" {...props} />,
  p: (props: any) => <p className="my-2 leading-relaxed" {...props} />,
  code: (props: any) => (
    <code className="bg-gray-100 px-1 py-0.5 rounded" {...props} />
  ),
};

export function MdxProvider({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}