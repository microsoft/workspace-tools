import path from "path";
import { searchUp } from "../../paths";

export type WorkspaceImplementations = "yarn" | "pnpm" | "rush" | "npm" | "lerna";
export interface ImplementationAndLockFile {
  implementation: WorkspaceImplementations | undefined;
  lockFile: string;
}
const workspaceCache: { [cwd: string]: ImplementationAndLockFile } = {};

export function getWorkspaceImplementationAndLockFile(
  cwd: string,
  cache = workspaceCache
): { implementation: WorkspaceImplementations | undefined; lockFile: string } | undefined {
  if (cache[cwd]) {
    return cache[cwd];
  }

  const lockFile = searchUp(["lerna.json", "rush.json", "yarn.lock", "pnpm-workspace.yaml", "package-lock.json"], cwd);

  if (!lockFile) {
    return;
  }

  switch (path.basename(lockFile)) {
    case "lerna.json":
      cache[cwd] = {
        implementation: "lerna",
        lockFile,
      };
      break;

    case "yarn.lock":
      cache[cwd] = {
        implementation: "yarn",
        lockFile,
      };
      break;

    case "pnpm-workspace.yaml":
      cache[cwd] = {
        implementation: "pnpm",
        lockFile,
      };
      break;

    case "rush.json":
      cache[cwd] = {
        implementation: "rush",
        lockFile,
      };
      break;

    case "package-lock.json":
      cache[cwd] = {
        implementation: "npm",
        lockFile,
      };
      break;
  }

  return cache[cwd];
}

export function getWorkspaceImplementation(cwd: string, cache = workspaceCache): WorkspaceImplementations | undefined {
  return getWorkspaceImplementationAndLockFile(cwd, cache)?.implementation;
}
