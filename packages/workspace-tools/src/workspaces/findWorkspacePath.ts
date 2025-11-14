import type { WorkspaceInfos } from "../types/WorkspaceInfo";

/**
 * Find the path for a particular package name from an array of info about packages ("workspaces"
 * in npm/yarn/pnpm terms) within a monorepo.
 * @param workspaces Array of info about packages within a monorepo
 * @param packageName Package name to find
 * @returns Package path if found, or undefined
 */
export function findWorkspacePath(workspaces: WorkspaceInfos, packageName: string): string | undefined {
  return workspaces.find(({ name }) => name === packageName)?.path;
}
