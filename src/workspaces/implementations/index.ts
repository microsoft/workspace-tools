import findUp from "find-up";

export type WorkspaceImplementations = "yarn" | "pnpm" | "rush";

export function getWorkspaceImplementation(
  cwd: string
): WorkspaceImplementations | undefined {
  const yarnLockPath = findUp.sync("yarn.lock", { cwd });
  if (yarnLockPath) {
    return "yarn";
  }

  const pnpmLockPath = findUp.sync("pnpm-workspace.yaml", { cwd });
  if (pnpmLockPath) {
    return "pnpm";
  }

  const rushJsonPath = findUp.sync("rush.json", { cwd });
  if (rushJsonPath) {
    return "rush";
  }
}
