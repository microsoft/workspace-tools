import { getWorkspaceRootInfo } from "workspace-tools-paths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getWorkspaceInfoFromWorkspaceRoot } from "./packageJsonWorkspaces";

export function getNpmWorkspaceRoot(cwd: string): string {
  const npmWorkspacesRoot = getWorkspaceRootInfo(cwd, "npm")?.root;

  if (!npmWorkspacesRoot) {
    throw new Error("Could not find NPM workspaces root");
  }

  return npmWorkspacesRoot;
}

export function getNpmWorkspaces(cwd: string): WorkspaceInfo {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(npmWorkspacesRoot);
}
