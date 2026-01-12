import { WorkspaceManager } from "./WorkspaceManager";
import { getWorkspaceManagerAndRoot } from "./implementations";

/**
 * Get the root directory of a monorepo, defined as the directory where the workspace/monorepo manager
 * config file is located. (Does not rely in any way on git, and the result is cached by `cwd`.)
 *
 * NOTE: "Workspace" here refers to the entire project/monorepo, not an individual package the way it does
 * in e.g. npm/yarn/pnpm "workspaces."
 *
 * @param cwd Start searching from here
 * @param preferredManager Search for only this manager's config file
 *
 * @deprecated Renamed to `getWorkspaceManagerRoot` to align "workspace" terminology with npm/yarn/pnpm.
 * In most cases, you should use `findProjectRoot` instead since it falls back to the git root if no
 * workspace manager is found (single-package projects).
 */
export function getWorkspaceRoot(cwd: string, preferredManager?: WorkspaceManager): string | undefined {
  return getWorkspaceManagerRoot(cwd, preferredManager);
}

/**
 * Get the root directory of a monorepo, defined as the directory where the workspace/monorepo manager
 * config file is located. (Does not rely in any way on git, and the result is cached by `cwd`.)
 *
 * @param cwd Start searching from here
 * @param preferredManager Search for only this manager's config file
 * @returns Workspace manager root directory, or undefined if not found
 */
export function getWorkspaceManagerRoot(cwd: string, preferredManager?: WorkspaceManager): string | undefined {
  return getWorkspaceManagerAndRoot(cwd, undefined, preferredManager)?.root;
}
