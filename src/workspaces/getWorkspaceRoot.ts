import {
  getWorkspaceImplementation,
  WorkspaceImplementations,
} from "./implementations";

import { getPnpmWorkspaceRoot } from "./implementations/pnpm";
import { getYarnWorkspaceRoot } from "./implementations/yarn";
import { getRushWorkspaceRoot } from "./implementations/rush";

import { WorkspaceManager } from "./WorkspaceManager";
import { getNpmWorkspaceRoot } from "./implementations/npm";
import { getLernaWorkspaceRoot } from "./implementations/lerna";

const workspaceGetter: {
  [key in WorkspaceImplementations]: (cwd: string) => string;
} = {
  yarn: getYarnWorkspaceRoot,
  pnpm: getPnpmWorkspaceRoot,
  rush: getRushWorkspaceRoot,
  npm: getNpmWorkspaceRoot,
  lerna: getLernaWorkspaceRoot,
};

const preferred = process.env
  .PREFERRED_WORKSPACE_MANAGER as WorkspaceManager | null;

export function getWorkspaceRoot(cwd: string): string | undefined {
  const workspaceImplementation = preferred || getWorkspaceImplementation(cwd);

  if (!workspaceImplementation || !workspaceGetter[workspaceImplementation]) {
    return;
  }

  return workspaceGetter[workspaceImplementation](cwd);
}
