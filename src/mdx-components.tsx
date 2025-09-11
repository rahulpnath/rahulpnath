import type { MDXComponents } from "mdx/types";
import PostCard from "./components/PostCard";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    PostCard, // now available globally
  };
}
