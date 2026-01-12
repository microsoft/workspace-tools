import { getWorkspaceUtilities, getWorkspaceManagerAndRoot } from "./implementations";
import type { WorkspaceInfos } from "../types/WorkspaceInfo";

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace" in
 * npm/yarn/pnpm terms) within a monorepo. The list of included packages is based on the
 * workspace/monorepo manager's config file.
 */
export function getWorkspaces(cwd: string): WorkspaceInfos {
  const utils = getWorkspaceUtilities(cwd);
  return utils?.getWorkspaces(cwd) || [];
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace" in
 * npm/yarn/pnpm terms) within a monorepo. The list of included packages is based on the
 * workspace/monorepo manager's config file.
 *
 * NOTE: As of writing, this will start promises to read all package.json files in parallel,
 * without direct concurrency control.
 */
export async function getWorkspacesAsync(cwd: string): Promise<WorkspaceInfos> {
  const utils = getWorkspaceUtilities(cwd);

  if (!utils) {
    return [];
  }

  if (!utils.getWorkspacesAsync) {
    const managerName = getWorkspaceManagerAndRoot(cwd)?.manager;
    throw new Error(`${cwd} is using ${managerName} which has not been converted to async yet`);
  }

  return utils.getWorkspacesAsync(cwd);
}
