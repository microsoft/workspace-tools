import {
  getWorkspaceImplementation,
  WorkspaceImplementations,
} from "./implementations";

import { getLernaWorkspaces } from "./implementations/lerna";
import { getNpmWorkspaces } from "./implementations/npm";
import { getPnpmWorkspaces } from "./implementations/pnpm";
import { getRushWorkspaces } from "./implementations/rush";
import { getYarnWorkspaces } from "./implementations/yarn";

import { WorkspaceInfo } from "../types/WorkspaceInfo";
import { WorkspaceManager } from "./WorkspaceManager";

const workspaceGetter: {
  [key in WorkspaceImplementations]: (cwd: string) => WorkspaceInfo;
} = {
  yarn: getYarnWorkspaces,
  pnpm: getPnpmWorkspaces,
  rush: getRushWorkspaces,
  npm: getNpmWorkspaces,
  lerna: getLernaWorkspaces,
};

const preferred = process.env
  .PREFERRED_WORKSPACE_MANAGER as WorkspaceManager | null;

export function getWorkspaces(cwd: string): WorkspaceInfo {
  const workspaceImplementation = preferred || getWorkspaceImplementation(cwd);

  if (!workspaceImplementation || !workspaceGetter[workspaceImplementation]) {
    return [];
  }

  return workspaceGetter[workspaceImplementation](cwd);
}
