import { WorkspaceInfo } from "./types/WorkspaceInfo";

export function findWorkspacePath(
  workspaces: WorkspaceInfo,
  packageName: string
): string | undefined {
  const workspace = workspaces.find(({ name }) => name === packageName);

  if (workspace) {
    return workspace.path;
  }
}
