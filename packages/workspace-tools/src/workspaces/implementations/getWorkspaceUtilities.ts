import type { Catalogs } from "../../types/Catalogs";
import type { WorkspaceInfos } from "../../types/WorkspaceInfo";
import { getWorkspaceManagerAndRoot } from "./getWorkspaceManagerAndRoot";
// These must be type imports to avoid parsing the additional deps at runtime
import type * as LernaUtilities from "./lerna";
import type * as NpmUtilities from "./npm";
import type * as PnpmUtilities from "./pnpm";
import type * as RushUtilities from "./rush";
import type * as YarnUtilities from "./yarn";

export interface WorkspaceUtilities {
  /**
   * Get an array of paths to packages ("workspaces") in the monorepo, based on the
   * manager's config file.
   */
  getWorkspacePackagePaths: (cwd: string) => string[];
  /**
   * Get an array of paths to packages ("workspaces") in the monorepo, based on the
   * manager's config file.
   */
  getWorkspacePackagePathsAsync?: (cwd: string) => Promise<string[]>;
  /**
   * Get an array with names, paths, and package.json contents for each package ("workspace")
   * in a monorepo.
   */
  getWorkspaces: (cwd: string) => WorkspaceInfos;
  /**
   * Get an array with names, paths, and package.json contents for each package ("workspace")
   * in a monorepo.
   */
  getWorkspacesAsync: (cwd: string) => Promise<WorkspaceInfos>;
  /**
   * Get version catalogs, if supported by the manager (only pnpm and yarn v4 as of writing).
   */
  getCatalogs?: (cwd: string) => Catalogs | undefined;
}

/**
 * Get utility implementations for the workspace manager of `cwd`.
 * Returns undefined if the manager can't be determined.
 */
export function getWorkspaceUtilities(cwd: string): WorkspaceUtilities | undefined {
  const manager = getWorkspaceManagerAndRoot(cwd)?.manager;

  switch (manager) {
    case "yarn":
      return require("./yarn") as typeof YarnUtilities;

    case "pnpm":
      return require("./pnpm") as typeof PnpmUtilities;

    case "rush":
      return require("./rush") as typeof RushUtilities;

    case "npm":
      return require("./npm") as typeof NpmUtilities;

    case "lerna":
      return require("./lerna") as typeof LernaUtilities;
  }
}
