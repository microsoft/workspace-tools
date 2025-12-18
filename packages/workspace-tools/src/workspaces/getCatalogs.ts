import type { Catalogs } from "../types/Catalogs";
import { getWorkspaceUtilities } from "./implementations";

/**
 * Get version catalogs, if supported by the manager (only pnpm and yarn v4 as of writing).
 * Returns undefined if no catalogs are present or the manager doesn't support them.
 * @see https://pnpm.io/catalogs
 * @see https://yarnpkg.com/features/catalogs
 * @param cwd - Current working directory. It will search up from here to find the root, with caching.
 */
export function getCatalogs(cwd: string): Catalogs | undefined {
  const utils = getWorkspaceUtilities(cwd);
  return utils?.getCatalogs?.(cwd);
}
