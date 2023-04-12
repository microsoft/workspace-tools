import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import {
  getPackageJsonWorkspaceRoot,
  getWorkspaceInfoFromWorkspaceRoot,
  getWorkspaceInfoFromWorkspaceRootAsync,
} from "./packageJsonWorkspaces";

export function getNpmWorkspaceRoot(cwd: string): string {
  const npmWorkspacesRoot = getPackageJsonWorkspaceRoot(cwd);

  if (!npmWorkspacesRoot) {
    throw new Error("Could not find NPM workspaces root");
  }

  return npmWorkspacesRoot;
}

export function getNpmWorkspaces(cwd: string): WorkspaceInfo {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(npmWorkspacesRoot);
}

export async function getNpmWorkspacesAsync(cwd: string): Promise<WorkspaceInfo> {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return await getWorkspaceInfoFromWorkspaceRootAsync(npmWorkspacesRoot);
}

export { getNpmWorkspaceRoot as getWorkspaceRoot };
export { getNpmWorkspaces as getWorkspaces };
export { getNpmWorkspacesAsync as getWorkspacesAsync };
