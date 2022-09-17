import { getWorkspaceRootInfo } from "workspace-tools-paths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getWorkspaceInfoFromWorkspaceRoot } from "./packageJsonWorkspaces";

export function getYarnWorkspaceRoot(cwd: string): string {
  const yarnWorkspacesRoot = getWorkspaceRootInfo(cwd, "yarn")?.root;

  if (!yarnWorkspacesRoot) {
    throw new Error("Could not find yarn workspaces root");
  }

  return yarnWorkspacesRoot;
}

export function getYarnWorkspaces(cwd: string): WorkspaceInfo {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(yarnWorkspacesRoot);
}
