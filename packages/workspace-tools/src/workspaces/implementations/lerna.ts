import fs from "fs";
import jju from "jju";
import path from "path";
import { isCachingEnabled } from "../../isCachingEnabled";
import { managerFiles } from "./getWorkspaceManagerAndRoot";
import { getWorkspaceUtilitiesBase } from "./getWorkspaceUtilitiesBase";
import type { WorkspaceUtilities } from "./WorkspaceUtilities";

export const lernaUtilities: WorkspaceUtilities = {
  getWorkspacePatterns: ({ root }) => {
    const lernaJsonPath = path.join(root, managerFiles.lerna);
    const lernaConfig = jju.parse(fs.readFileSync(lernaJsonPath, "utf-8")) as { packages?: string[] };
    if (lernaConfig.packages) {
      return { patterns: lernaConfig.packages, type: "pattern" };
    }

    // Newer lerna versions also pick up workspaces from the package manager.
    const actualManager = getActualManager({ root });
    if (!actualManager) {
      throw new Error(`${lernaJsonPath} does not define "packages", and no known package manager was found.`);
    }

    const managerUtils = getWorkspaceUtilitiesBase(actualManager);
    return managerUtils.getWorkspacePatterns({ root });
  },

  // lerna could theoretically use yarn or pnpm catalogs
  getCatalogs: ({ root }) => {
    const actualManager = getActualManager({ root });
    return actualManager && getWorkspaceUtilitiesBase(actualManager).getCatalogs?.({ root });
  },
};

/** Mapping from lerna repo root to actual package manager */
const managerCache = new Map<string, "yarn" | "pnpm" | "npm" | undefined>();

/**
 * Get the actual package manager used by a lerna monorepo (with caching).
 */
function getActualManager(params: { root: string }): "yarn" | "pnpm" | "npm" | undefined {
  const { root } = params;
  if (isCachingEnabled() && managerCache.has(root)) {
    return managerCache.get(root);
  }

  for (const manager of ["npm", "yarn", "pnpm"] as const) {
    const managerPath = path.join(root, managerFiles[manager]);
    if (fs.existsSync(managerPath)) {
      managerCache.set(root, manager);
      return manager;
    }
  }

  managerCache.set(root, undefined);
  return undefined;
}
