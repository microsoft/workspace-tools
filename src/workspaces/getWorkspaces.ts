import {
  getWorkspaceImplementation,
  WorkspaceImplementations,
} from "./implementations";

import { getPnpmWorkspaces } from "./implementations/pnpm";
import { getYarnWorkspaces } from "./implementations/yarn";
import { getRushWorkspaces } from "./implementations/rush";
import { WorkspaceInfo } from "../types/WorkspaceInfo";
import { WorkspaceManager } from "./WorkspaceManager";

const workspaceGetter: {
  [key in WorkspaceImplementations]: (cwd: string) => WorkspaceInfo;
} = {
  yarn: getYarnWorkspaces,
  pnpm: getPnpmWorkspaces,
  rush: getRushWorkspaces,
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
