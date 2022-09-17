import fs from "fs";
import jju from "jju";
import path from "path";
import { getWorkspaceRootInfo } from "workspace-tools-paths";
import { getPackagePaths } from "../../getPackagePaths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo } from "../getWorkspacePackageInfo";

export function getLernaWorkspaceRoot(cwd: string): string {
  const lernaRoot = getWorkspaceRootInfo(cwd, "lerna")?.root;

  if (!lernaRoot) {
    throw new Error("Could not find lerna workspace root");
  }

  return lernaRoot;
}

export function getLernaWorkspaces(cwd: string, ignorePatterns?: string[]): WorkspaceInfo {
  try {
    const lernaWorkspaceRoot = getLernaWorkspaceRoot(cwd);
    const lernaJsonPath = path.join(lernaWorkspaceRoot, "lerna.json");

    const lernaConfig = jju.parse(fs.readFileSync(lernaJsonPath, "utf-8"));

    const packagePaths = getPackagePaths(lernaWorkspaceRoot, lernaConfig.packages, ignorePatterns);
    const workspaceInfo = getWorkspacePackageInfo(packagePaths);
    return workspaceInfo;
  } catch {
    return [];
  }
}
