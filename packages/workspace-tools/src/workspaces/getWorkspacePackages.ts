import { getWorkspaceRootInfo } from "workspace-tools-paths";
import { PackageInfos } from "../types/PackageInfo";
import { getLernaWorkspacePackages } from "./managers/lerna";
import { getNpmWorkspacePackages } from "./managers/npm";
import { getPnpmWorkspacePackages } from "./managers/pnpm";
import { getRushWorkspacePackages } from "./managers/rush";
import { getYarnWorkspacePackages } from "./managers/yarn";

/**
 * Determine the workspace manager being used for `cwd` (or a parent) and return info about all
 * the packages in the workspace, as specified in the workspace definition.
 */
export function getWorkspacePackages(cwd: string): PackageInfos {
  const info = getWorkspaceRootInfo(cwd);

  if (!info) {
    return {};
  }

  switch (info.manager) {
    case "yarn":
      return getYarnWorkspacePackages(info.root);
    case "npm":
      return getNpmWorkspacePackages(info.root);

    case "pnpm":
      return getPnpmWorkspacePackages(info.root);
    case "rush":
      return getRushWorkspacePackages(info.root);
    case "lerna":
      return getLernaWorkspacePackages(info.root);
  }
}
