import { WorkspaceInfo } from "../types/WorkspaceInfo";

/**
 * Find the path for a particular package name from an array of info about packages within a workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 * @param workspaces Array of info about packages within a workspace
 * @param packageName Package name to find
 * @returns Package path if found, or undefined
 */
export function findWorkspacePath(workspaces: WorkspaceInfo, packageName: string): string | undefined {
  const workspace = workspaces.find(({ name }) => name === packageName);

  if (workspace) {
    return workspace.path;
  }
}
