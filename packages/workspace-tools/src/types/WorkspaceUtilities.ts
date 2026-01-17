import type { Catalogs } from "./Catalogs";

export interface WorkspaceUtilities {
  /**
   * Get the root path for this workspace/monorepo manager, with caching.
   * Returns undefined (and verbose logs) on error or if not found, unless `throwOnError` is set.
   */
  getWorkspaceManagerRoot(cwd: string): string | undefined;
  getWorkspaceManagerRoot(cwd: string, options: { throwOnError: true }): string;

  /**
   * Get the original glob patterns or package paths from the manager's workspaces config.
   * (For rush, the "patterns" will be complete paths.)
   *
   * @returns Array of patterns or paths, or undefined if not available
   * (also verbose logs if there was an error)
   */
  getWorkspacePatterns: (cwd: string) => string[] | undefined;

  /**
   * Get an array of paths to packages ("workspaces") in the monorepo, based on the
   * manager's config file.
   * @returns Array of monorepo package paths, or undefined on error
   * (also verbose logs if there was an error)
   */
  getWorkspacePackagePaths: (cwd: string) => string[] | undefined;

  /**
   * Get an array of paths to packages ("workspaces") in the monorepo, based on the
   * manager's config file.
   * @returns Array of monorepo package paths, or undefined on error
   */
  getWorkspacePackagePathsAsync: (cwd: string) => Promise<string[] | undefined>;

  // /**
  //  * Get an array with names, paths, and package.json contents for each package ("workspace")
  //  * in a monorepo.
  //  * @returns Array of monorepo package infos, or undefined on error
  //  */
  // getWorkspaces: (cwd: string) => WorkspaceInfos | undefined;

  // /**
  //  * Get an array with names, paths, and package.json contents for each package ("workspace")
  //  * in a monorepo.
  //  * @returns Array of monorepo package infos, or undefined on error
  //  */
  // getWorkspacesAsync: (cwd: string) => Promise<WorkspaceInfos | undefined>;

  /**
   * Get version catalogs, if supported by the manager (only pnpm and yarn v4 as of writing).
   * Returns undefined if not defined or not supported.
   */
  getCatalogs: (cwd: string) => Catalogs | undefined;
}
