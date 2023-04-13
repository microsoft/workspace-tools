import { getWorkspaceUtilities, getWorkspaceManager } from "./implementations";
import { WorkspaceInfo } from "../types/WorkspaceInfo";

/**
 * Get an array with names, paths, and package.json contents for each package in a workspace.
 * The list of included packages is based on the workspace manager's config file.
 *
 * The method name is somewhat misleading due to the double meaning of "workspace", but it's retained
 * for compatibility. "Workspace" here refers to an individual package, in the sense of the `workspaces`
 * package.json config used by npm/yarn (instead of referring to the entire monorepo).
 */
export function getWorkspaces(cwd: string): WorkspaceInfo {
  const utils = getWorkspaceUtilities(cwd);
  return utils?.getWorkspaces(cwd) || [];
}

/**
 * Get an array with names, paths, and package.json contents for each package in a workspace.
 * The list of included packages is based on the workspace manager's config file.
 *
 * The method name is somewhat misleading due to the double meaning of "workspace", but it's retained
 * for compatibility. "Workspace" here refers to an individual package, in the sense of the `workspaces`
 * package.json config used by npm/yarn (instead of referring to the entire monorepo).
 */
export async function getWorkspacesAsync(cwd: string): Promise<WorkspaceInfo> {
  const utils = getWorkspaceUtilities(cwd);

  if (!utils) {
    return [];
  }

  if (!utils.getWorkspacesAsync) {
    const managerName = getWorkspaceManager(cwd);
    throw new Error(`${cwd} is using ${managerName} which has not been converted to async yet`);
  }

  return utils.getWorkspacesAsync(cwd);
}
