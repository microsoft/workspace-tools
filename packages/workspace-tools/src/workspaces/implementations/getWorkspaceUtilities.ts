import type { WorkspaceManager } from "../../types/WorkspaceManager";
import { getWorkspaceUtilitiesBase } from "./getWorkspaceUtilitiesBase";
import type { WorkspaceUtilities } from "./WorkspaceUtilities";

const utils: Partial<Record<WorkspaceManager, WorkspaceUtilities>> = {};

/**
 * Get utility implementations for the given workspace/monorepo manager.
 * Returns undefined if `manager` has no custom utilities.
 */
export function getWorkspaceUtilities(manager: WorkspaceManager): WorkspaceUtilities {
  switch (manager) {
    case "npm":
    case "yarn":
    case "pnpm":
      utils[manager] ??= getWorkspaceUtilitiesBase(manager);
      return utils[manager]!;

    case "rush":
      utils.rush ??= (require("./rush") as typeof import("./rush")).rushUtilities;
      return utils.rush;

    case "lerna":
      utils.lerna ??= (require("./lerna") as typeof import("./lerna")).lernaUtilities;
      return utils.lerna;
  }
}
