import { getWorkspaceUtilities } from "./implementations";

/**
 * Get the root directory of a workspace/monorepo, defined as the directory where the workspace
 * manager config file is located.
 */
export function getWorkspaceRoot(cwd: string): string | undefined {
  const impl = getWorkspaceUtilities(cwd);
  return impl?.getWorkspaceRoot(cwd);
}
