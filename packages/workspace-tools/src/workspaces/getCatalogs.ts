import type { Catalogs } from "../types/Catalogs";
import { getWorkspaceManagerAndRoot, getWorkspaceUtilities } from "./implementations";
import type { WorkspaceManager } from "./WorkspaceManager";

/**
 * Get version catalogs, if supported by the manager (only pnpm and yarn v4 as of writing).
 * Returns undefined if no catalogs are present or the manager doesn't support them.
 * @see https://pnpm.io/catalogs
 * @see https://yarnpkg.com/features/catalogs
 *
 * @param cwd - Current working directory. It will search up from here to find the root, with caching.
 * @param manager Workspace/monorepo manager to use instead of auto-detecting
 *
 * @returns Catalogs if defined, or undefined if not available
 * (logs verbose warnings instead of throwing on error)
 */
export function getCatalogs(cwd: string, manager?: WorkspaceManager): Catalogs | undefined {
  manager ??= getWorkspaceManagerAndRoot(cwd)?.manager;
  return manager && getWorkspaceUtilities(cwd, manager).getCatalogs(cwd);
}
