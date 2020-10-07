import { getWorkspaceImplementation } from "./implementations";

import { getPnpmWorkspaceRoot } from "./implementations/pnpm";
import { getYarnWorkspaceRoot } from "./implementations/yarn";
import { getRushWorkspaceRoot } from "./implementations/rush";

export function getWorkspaceRoot(cwd: string): string | undefined {
  const workspaceImplementation = getWorkspaceImplementation(cwd);

  if (!workspaceImplementation) {
    return;
  }

  switch (workspaceImplementation) {
    case "yarn":
      return getYarnWorkspaceRoot(cwd);
    case "pnpm":
      return getPnpmWorkspaceRoot(cwd);
    case "rush":
      return getRushWorkspaceRoot(cwd);
  }
}
