import type { WorkspaceManager } from "../../types/WorkspaceManager";
import type { WorkspaceUtilities } from "./WorkspaceUtilities";

const utils: Partial<Record<WorkspaceManager, WorkspaceUtilities>> = {};

/**
 * Get utility implementations for the given workspace/monorepo manager.
 */
export function getWorkspaceUtilities(manager: WorkspaceManager): WorkspaceUtilities {
  switch (manager) {
    case "npm":
      utils.npm ??= (require("./npm") as typeof import("./npm")).npmUtilities;
      break;

    case "pnpm":
      utils.pnpm ??= (require("./pnpm") as typeof import("./pnpm")).pnpmUtilities;
      break;

    case "yarn":
      utils.yarn ??= (require("./yarn") as typeof import("./yarn")).yarnUtilities;
      break;

    case "rush":
      utils.rush ??= (require("./rush") as typeof import("./rush")).rushUtilities;
      break;

    case "lerna":
      utils.lerna ??= (require("./lerna") as typeof import("./lerna")).lernaUtilities;
      break;
  }

  return utils[manager]!;
}
