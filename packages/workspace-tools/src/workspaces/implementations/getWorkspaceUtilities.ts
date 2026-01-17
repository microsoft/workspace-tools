import type { WorkspaceUtilities } from "../../types/WorkspaceUtilities";
import type { WorkspaceManager } from "../WorkspaceManager";
import { getWorkspaceManagerAndRoot } from "./getWorkspaceManagerAndRoot";
import { getWorkspaceUtilitiesBase } from "./getWorkspaceUtilitiesBase";

const utils: Partial<Record<WorkspaceManager, WorkspaceUtilities>> = {};

/**
 * Get utility implementations for the workspace/monorepo manager of `cwd`, or for `manager` if set.
 *
 * If `manager` is not provided, it will search up from `cwd` to find a manager file and monorepo root
 * (with caching). Returns undefined if the manager isn't set and can't be determined.
 */
export function getWorkspaceUtilities(cwd: string): WorkspaceUtilities | undefined;
export function getWorkspaceUtilities(cwd: string, manager: WorkspaceManager): WorkspaceUtilities;
export function getWorkspaceUtilities(cwd: string, manager?: WorkspaceManager): WorkspaceUtilities | undefined {
  manager ??= getWorkspaceManagerAndRoot(cwd)?.manager;

  switch (manager) {
    case "npm":
    case "yarn":
    case "pnpm":
      utils[manager] ??= getWorkspaceUtilitiesBase(manager);
      return utils[manager];

    case "rush":
      utils.rush ??= (require("./rush") as typeof import("./rush")).rushUtilities;
      return utils.rush;

    case "lerna":
      utils.lerna ??= (require("./lerna") as typeof import("./lerna")).lernaUtilities;
      return utils.lerna;
  }
}
