import type { WorkspaceUtilities } from "./WorkspaceUtilities";

const utils: Partial<Record<"npm" | "yarn" | "pnpm", WorkspaceUtilities>> = {};

/**
 * Get the utilities for underlying package managers.
 * This prevents circular references in the lerna utilities.
 */
export function getWorkspaceUtilitiesBase(manager: "npm" | "yarn" | "pnpm"): WorkspaceUtilities {
  switch (manager) {
    case "npm":
      utils.npm ??= (require("./npm") as typeof import("./npm")).npmUtilities;
      return utils.npm!;
    case "yarn":
      utils.yarn ??= (require("./yarn") as typeof import("./yarn")).yarnUtilities;
      return utils.yarn!;
    case "pnpm":
      utils.pnpm ??= (require("./pnpm") as typeof import("./pnpm")).pnpmUtilities;
      return utils.pnpm!;
  }
}
