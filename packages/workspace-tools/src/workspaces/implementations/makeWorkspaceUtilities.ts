import { getPackagePaths, getPackagePathsAsync } from "../../getPackagePaths";
import { logVerboseWarning } from "../../logging";
import type { Catalogs } from "../../types/Catalogs";
import type { WorkspaceUtilities } from "../../types/WorkspaceUtilities";
import type { WorkspaceManager } from "../WorkspaceManager";
import { getWorkspaceManagerAndRoot } from "./getWorkspaceManagerAndRoot";
import { getPackageJsonWorkspacePatterns } from "./packageJsonWorkspaces";

/**
 * Most utilities for different monorepo/workspace managers have similar or identical implementations.
 * This function wraps the common implementations plus any overrides and adds error handling.
 *
 * @param overrides Optional overrides for specific utility functions (these ARE allowed to throw
 * on error). Any workspace functions not provided will use the most common implementations based
 * on package.json `workspaces`. `getCatalogs` returns undefined by default.
 */
export function makeWorkspaceUtilities(
  manager: WorkspaceManager,
  overrides?: {
    /**
     * Get the original glob patterns or package paths from the manager's workspaces config.
     * This is only needed if the workspaces aren't defined in package.json `workspaces`.
     *
     * @returns Array of patterns or paths, or undefined if not available (can also throw on error)
     */
    // use object params so it's obvious the root is expected
    getWorkspacePatterns?: (params: { root: string }) => string[] | undefined;

    /**
     * Get the package paths from the manager's workspaces config.
     * This is only needed if the values returned from `getWorkspacePatterns` aren't globs (rush).
     *
     * @returns Array of paths, or undefined if not available (can also throw on error)
     */
    getWorkspacePackagePaths?: (params: { root: string }) => string[] | undefined;

    /**
     * Get version catalogs, if supported by the manager (only pnpm and yarn v4 as of writing).
     * Returns undefined if not defined or not supported.
     */
    getCatalogs?: (params: { root: string }) => Catalogs | undefined;
  }
): WorkspaceUtilities {
  // Implement the variadic signature from WorkspaceUtilities
  const getWorkspaceManagerRoot = ((cwd: string, options?: { throwOnError: true }) => {
    let root: string | undefined;
    try {
      root = getWorkspaceManagerAndRoot(cwd, undefined, manager)?.root;
    } catch (err) {
      logVerboseWarning(`Error getting ${manager} root from ${cwd}`, err);
    }

    if (root) {
      return root;
    }

    if (options?.throwOnError) {
      throw new Error(`Could not find ${manager} root from ${cwd}`);
    }
    logVerboseWarning(`Could not find ${manager} root from ${cwd}`);
    return undefined;
    // This has to be cast due to the variadic signature
  }) as WorkspaceUtilities["getWorkspaceManagerRoot"];

  const getWorkspacePatterns: WorkspaceUtilities["getWorkspacePatterns"] = (cwd) => {
    const root = getWorkspaceManagerRoot(cwd);
    if (!root) return undefined;

    try {
      const getPatterns = overrides?.getWorkspacePatterns || getPackageJsonWorkspacePatterns;
      return getPatterns({ root });
    } catch (err) {
      logVerboseWarning(`Error getting ${manager} workspace patterns for ${cwd}`, err);
    }
    return undefined;
  };

  const getWorkspacePackagePaths: WorkspaceUtilities["getWorkspacePackagePaths"] = (cwd) => {
    const root = getWorkspaceManagerRoot(cwd);
    if (!root) return undefined;

    try {
      if (overrides?.getWorkspacePackagePaths) {
        return overrides.getWorkspacePackagePaths({ root });
      }

      const workspacePatterns = getWorkspacePatterns(cwd);
      if (workspacePatterns) {
        return getPackagePaths({ root, packageGlobs: workspacePatterns });
      }
    } catch (err) {
      logVerboseWarning(`Error getting ${manager} workspace package paths for ${cwd}`, err);
    }
    return undefined;
  };

  return {
    getWorkspaceManagerRoot,
    getWorkspacePatterns,
    getWorkspacePackagePaths,

    getWorkspacePackagePathsAsync: async (cwd) => {
      if (overrides?.getWorkspacePackagePaths) {
        // Use the sync implementation if it's a manager (rush) where the paths are hardcoded
        // and therefore async globbing is irrelevant.
        return getWorkspacePackagePaths(cwd);
      }

      const root = getWorkspaceManagerRoot(cwd);
      if (!root) return undefined;

      try {
        const workspacePatterns = getWorkspacePatterns(cwd);
        if (workspacePatterns) {
          return getPackagePathsAsync({ root, packageGlobs: workspacePatterns });
        }
      } catch (err) {
        logVerboseWarning(`Error getting ${manager} workspace package paths for ${cwd}`, err);
      }
      return undefined;
    },

    getCatalogs: (cwd) => {
      if (!overrides?.getCatalogs) return undefined;

      const root = getWorkspaceManagerRoot(cwd);
      if (!root) return undefined;

      try {
        return overrides.getCatalogs({ root });
      } catch (err) {
        logVerboseWarning(`Error getting ${manager} catalogs for ${cwd}`, err);
      }
      return undefined;
    },
  };
}
