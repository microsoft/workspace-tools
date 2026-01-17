import path from "path";
import { searchUp } from "../../paths";
import { WorkspaceManager } from "../WorkspaceManager";
import { isCachingEnabled } from "../../isCachingEnabled";

export interface WorkspaceManagerAndRoot {
  /** Workspace/monorepo manager name */
  manager: WorkspaceManager;
  /** Monorepo root, where the manager configuration file is located */
  root: string;
}
const workspaceCache = new Map<string, WorkspaceManagerAndRoot | undefined>();

/**
 * Files indicating the monorepo root for each manager.
 *
 * DO NOT REORDER! The order of keys determines the precedence of the files, which is
 * important for cases like lerna where lerna.json and e.g. yarn.lock may both exist.
 */
export const managerFiles = {
  // DO NOT REORDER! (see above)
  lerna: "lerna.json",
  rush: "rush.json",
  yarn: "yarn.lock",
  pnpm: "pnpm-workspace.yaml",
  npm: "package-lock.json",
} as const;

/**
 * Get the preferred workspace/monorepo manager based on `process.env.PREFERRED_WORKSPACE_MANAGER`
 * (if valid).
 */
export function getPreferredWorkspaceManager(): WorkspaceManager | undefined {
  const preferred = process.env.PREFERRED_WORKSPACE_MANAGER as WorkspaceManager | undefined;
  return preferred && managerFiles[preferred] ? preferred : undefined;
}

/**
 * Get the workspace/monorepo manager name and root directory for `cwd`, with caching.
 * Also respects the `process.env.PREFERRED_WORKSPACE_MANAGER` override, provided the relevant
 * manager file exists.
 * @param cwd Directory to search up from
 * @param cache Optional override cache for testing
 * @param preferredManager Optional override manager (if provided, only searches for this manager's file)
 * @returns Workspace/monorepo manager and root, or undefined if it can't be determined
 */
export function getWorkspaceManagerAndRoot(
  cwd: string,
  cache?: Map<string, WorkspaceManagerAndRoot | undefined>,
  preferredManager?: WorkspaceManager
): WorkspaceManagerAndRoot | undefined {
  cache = cache || workspaceCache;
  if (isCachingEnabled() && cache.has(cwd)) {
    return cache.get(cwd);
  }

  preferredManager = preferredManager || getPreferredWorkspaceManager();
  const managerFile = searchUp(
    (preferredManager && managerFiles[preferredManager]) || Object.values(managerFiles),
    cwd
  );

  if (managerFile) {
    const managerFileName = path.basename(managerFile);
    cache.set(cwd, {
      manager: (Object.keys(managerFiles) as WorkspaceManager[]).find(
        (name) => managerFiles[name] === managerFileName
      )!,
      root: path.dirname(managerFile),
    });
  } else {
    // Avoid searching again if no file was found
    cache.set(cwd, undefined);
  }

  return cache.get(cwd);
}

/**
 * Get the root directory of a monorepo, defined as the directory where the workspace/monorepo manager
 * config file is located. (Does not rely in any way on git, and the result is cached by `cwd`.)
 *
 * @param cwd Start searching from here
 * @param manager Search for only this manager's config file
 * @returns Workspace manager root directory, or undefined if not found
 */
export function getWorkspaceManagerRoot(cwd: string, manager?: WorkspaceManager): string | undefined {
  return getWorkspaceManagerAndRoot(cwd, undefined, manager)?.root;
}
