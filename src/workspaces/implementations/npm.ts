import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getPackageJsonWorkspaceRoot, getWorkspaceInfoFromWorkspaceRoot } from "./packageJsonWorkspaces";

export function getNpmWorkspaceRoot(cwd: string): string {
  const npmWorkspacesRoot = getPackageJsonWorkspaceRoot(cwd);

  if (!npmWorkspacesRoot) {
    throw new Error("Could not find NPM workspaces root");
  }

  return npmWorkspacesRoot;
}

export function getNpmWorkspaces(cwd: string): WorkspaceInfo {
  const yarnWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(yarnWorkspacesRoot);
}
