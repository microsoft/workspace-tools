import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import {
  getPackageJsonWorkspaceRoot,
  getWorkspaceInfoFromWorkspaceRoot,
  getWorkspaceInfoFromWorkspaceRootAsync,
} from "./packageJsonWorkspaces";

export function getYarnWorkspaceRoot(cwd: string): string {
  const yarnWorkspacesRoot = getPackageJsonWorkspaceRoot(cwd);

  if (!yarnWorkspacesRoot) {
    throw new Error("Could not find yarn workspaces root");
  }

  return yarnWorkspacesRoot;
}

/**
 * Get an array with names, paths, and package.json contents for each package in a yarn workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export function getYarnWorkspaces(cwd: string): WorkspaceInfo {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(yarnWorkspacesRoot);
}

/**
 * Get an array with names, paths, and package.json contents for each package in a yarn workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export async function getYarnWorkspacesAsync(cwd: string): Promise<WorkspaceInfo> {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return await getWorkspaceInfoFromWorkspaceRootAsync(yarnWorkspacesRoot);
}

export { getYarnWorkspaceRoot as getWorkspaceRoot };
export { getYarnWorkspaces as getWorkspaces };
export { getYarnWorkspacesAsync as getWorkspacesAsync };
