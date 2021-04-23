import findUp from "find-up";

export type WorkspaceImplementations = "yarn" | "pnpm" | "rush" | "npm" | 'lerna';

export function getWorkspaceImplementation(
  cwd: string
): WorkspaceImplementations | undefined {
  // This needs to come before Yarn and NPM because
  // lerna can be used with either package manager
  const lernaJsonPath = findUp.sync("lerna.json", { cwd });
  if (lernaJsonPath) {
    return "lerna";
  }
  
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

  const npmLockPath = findUp.sync("package-lock.json", { cwd });
  if (npmLockPath) {
    return "npm";
  }
}
