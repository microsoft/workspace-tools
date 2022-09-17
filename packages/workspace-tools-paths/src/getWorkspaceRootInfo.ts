import path from "path";
import { searchUp } from "./searchUp";

export type WorkspaceManager = "npm" | "yarn" | "pnpm" | "rush" | "lerna";

export interface WorkspaceRootInfo {
  manager: WorkspaceManager;
  root: string;
}

/**
 * Map from a file that will always be found at the root of a particular manager's workspace
 * to the manager name.
 */
const workspaceFileToManager = {
  // DO NOT reorder these keys! The search order matters since it's possible for e.g. lerna and yarn
  // to both be used in the same repo.
  "lerna.json": "lerna",
  "rush.json": "rush",
  "yarn.lock": "yarn",
  "pnpm-workspace.yaml": "pnpm",
  "package-lock.json": "npm",
} as const;

const preferred = process.env.PREFERRED_WORKSPACE_MANAGER as WorkspaceManager | undefined;

/** Map from cwd to workspace info */
const workspaceCache = new Map<string, WorkspaceRootInfo>();

/** Clear the cached mappings from from cwd to workspace manager info */
export function clearWorkspaceRootCache() {
  workspaceCache.clear();
}

/**
 * Gets the workspace root directory and manager type for the given `cwd`.
 * @param cwd The directory to search up from
 * @param manager If provided, only look for a workspace root file for this manager.
 * Respects `process.env.PREFERRED_WORKSPACE_MANAGER` (if set) by default.
 */
export function getWorkspaceRootInfo(
  cwd: string,
  manager: WorkspaceManager | undefined = preferred
): WorkspaceRootInfo | undefined {
  const cached = workspaceCache.get(cwd);
  if (cached) {
    return cached;
  }

  if (manager && !Object.values(workspaceFileToManager).includes(manager)) {
    throw new Error(`Unsupported workspace manager: ${manager}`);
  }

  const filesToSearch = manager
    ? Object.keys(workspaceFileToManager).filter((f) => (workspaceFileToManager as any)[f] === preferred)
    : Object.keys(workspaceFileToManager);
  const rootFile = searchUp(filesToSearch, cwd);

  if (!rootFile) {
    return;
  }

  const res = {
    manager: workspaceFileToManager[path.basename(rootFile) as keyof typeof workspaceFileToManager],
    root: path.dirname(rootFile),
  };
  workspaceCache.set(cwd, res);

  return res;
}
