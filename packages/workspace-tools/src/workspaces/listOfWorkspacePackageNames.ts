import type { WorkspaceInfos } from "../types/WorkspaceInfo";

/**
 * @deprecated Just write `workspaces.map(w => w.name)` directly
 */
export function listOfWorkspacePackageNames(workspaces: WorkspaceInfos): string[] {
  return workspaces.map(({ name }) => name);
}
