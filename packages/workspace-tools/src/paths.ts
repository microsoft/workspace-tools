import path from "path";
import { findGitRoot } from "workspace-tools-paths";
import { getWorkspaceRoot } from "./workspaces/getWorkspaceRoot";

/**
 * Starting from `cwd`, searches up the directory hierarchy for the workspace root,
 * falling back to the git root if no workspace is detected.
 */
export function findProjectRoot(cwd: string) {
  let workspaceRoot: string | undefined;
  try {
    workspaceRoot = getWorkspaceRoot(cwd);
  } catch {}

  return workspaceRoot || findGitRoot(cwd);
}

/** @deprecated */
export function isChildOf(child: string, parent: string) {
  const relativePath = path.relative(child, parent);
  return /^[.\/\\]+$/.test(relativePath);
}
