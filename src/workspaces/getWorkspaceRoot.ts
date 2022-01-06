import { getWorkspaceImplementation } from "./implementations";

import { WorkspaceManager } from "./WorkspaceManager";

const preferred = process.env.PREFERRED_WORKSPACE_MANAGER as WorkspaceManager | null;

export function getWorkspaceRoot(cwd: string): string | undefined {
  const workspaceImplementation = preferred || getWorkspaceImplementation(cwd);

  if (!workspaceImplementation) {
    return;
  }

  switch (workspaceImplementation) {
    case "yarn":
      return require(`./implementations/yarn`).getYarnWorkspaceRoot(cwd);

    case "pnpm":
      return require(`./implementations/pnpm`).getPnpmWorkspaceRoot(cwd);

    case "rush":
      return require(`./implementations/rush`).getRushWorkspaceRoot(cwd);

    case "npm":
      return require(`./implementations/npm`).getNpmWorkspaceRoot(cwd);

    case "lerna":
      return require(`./implementations/lerna`).getLernaWorkspaceRoot(cwd);
  }
}
