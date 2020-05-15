import { WorkspaceInfo } from "../types/WorkspaceInfo";

export function listOfWorkspacePackageNames(
  workspaces: WorkspaceInfo
): string[] {
  return workspaces.map(({ name }) => name);
}
