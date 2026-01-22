import type { Catalogs } from "../../types/Catalogs";

export interface WorkspaceUtilities {
  /**
   * Get the original glob patterns or package paths from the manager's workspaces config.
   * This is only needed if the workspaces aren't defined in package.json `workspaces`.
   *
   * @returns Object with the patterns, or undefined if not available (or it can throw
   * if the patterns aren't available or there's an error)
   */
  // use object params so it's obvious the root is expected
  getWorkspacePatterns: (params: { root: string }) =>
    | {
        patterns: string[];
        /** "pattern" means the strings may be globs, "path" means they're relative paths */
        type: "pattern" | "path";
      }
    | undefined;

  /**
   * Get version catalogs, if supported by the manager (only pnpm and yarn v4 as of writing).
   * Returns undefined if not defined or not supported, or can throw an error.
   */
  getCatalogs?: (params: { root: string }) => Catalogs | undefined;
}
