import path from "path";
import { searchUp } from "../../paths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { WorkspaceManager } from "../WorkspaceManager";
// These must be type imports to avoid parsing the additional deps at runtime
import type * as LernaUtilities from "./lerna";
import type * as NpmUtilities from "./npm";
import type * as PnpmUtilities from "./pnpm";
import type * as RushUtilities from "./rush";
import type * as YarnUtilities from "./yarn";

export interface WorkspaceManagerAndRoot {
  manager: WorkspaceManager;
  root: string;
}
const workspaceCache = new Map<string, WorkspaceManagerAndRoot | undefined>();

const preferred = process.env.PREFERRED_WORKSPACE_MANAGER as WorkspaceManager | undefined;

/**
 * Get the workspace manager name and workspace root directory for `cwd`.
 * Returns undefined if the manager can't be determined.
 */
export function getWorkspaceManagerAndRoot(cwd: string, cache = workspaceCache): WorkspaceManagerAndRoot | undefined {
  if (cache.has(cwd)) {
    return cache.get(cwd);
  }

  const lockFile = searchUp(["lerna.json", "rush.json", "yarn.lock", "pnpm-workspace.yaml", "package-lock.json"], cwd);

  if (!lockFile) {
    return;
  }

  const root = path.dirname(lockFile);

  switch (path.basename(lockFile)) {
    case "lerna.json":
      cache.set(cwd, { manager: "lerna", root });
      break;

    case "yarn.lock":
      cache.set(cwd, { manager: "yarn", root });
      break;

    case "pnpm-workspace.yaml":
      cache.set(cwd, { manager: "pnpm", root });
      break;

    case "rush.json":
      cache.set(cwd, { manager: "rush", root });
      break;

    case "package-lock.json":
      cache.set(cwd, { manager: "npm", root });
      break;

    default:
      // Avoid searching again if no file was found
      cache.set(cwd, undefined);
  }

  return cache.get(cwd);
}

/**
 * Get the workspace manager name for `cwd`.
 * Returns undefined if the manager can't be determined.
 */
export function getWorkspaceManager(cwd: string, cache = workspaceCache): WorkspaceManager | undefined {
  return preferred || getWorkspaceManagerAndRoot(cwd, cache)?.manager;
}

/**
 * Get utility implementations for the workspace manager of `cwd`.
 * Returns undefined if the manager can't be determined.
 */
export function getWorkspaceUtilities(cwd: string):
  | {
      getWorkspaceRoot: (cwd: string) => string;
      getWorkspaces: (cwd: string) => WorkspaceInfo;
      getWorkspacesAsync?: (cwd: string) => Promise<WorkspaceInfo>;
    }
  | undefined {
  const manager = getWorkspaceManager(cwd);

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
