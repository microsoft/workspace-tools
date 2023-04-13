import { getWorkspaceUtilities, getWorkspaceManager } from "./implementations";

import { WorkspaceInfo } from "../types/WorkspaceInfo";

export function getWorkspaces(cwd: string): WorkspaceInfo {
  const impl = getWorkspaceUtilities(cwd);
  return impl?.getWorkspaces(cwd) || [];
}

export async function getWorkspacesAsync(cwd: string): Promise<WorkspaceInfo> {
  const impl = getWorkspaceUtilities(cwd);

  if (!impl) {
    return [];
  }

  if (!impl.getWorkspacesAsync) {
    const managerName = getWorkspaceManager(cwd);
    throw new Error(`${cwd} is using ${managerName} which has not been converted to async yet`);
  }

  return impl.getWorkspacesAsync(cwd);
}
