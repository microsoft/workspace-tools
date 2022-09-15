import { PackageInfos } from "../../types/PackageInfo";
import { getNpmWorkspacePackages } from "./npm";

export function getYarnWorkspacePackages(yarnWorkspaceRoot: string): PackageInfos {
  // npm and yarn declare workspaces the same way
  return getNpmWorkspacePackages(yarnWorkspaceRoot);
}
