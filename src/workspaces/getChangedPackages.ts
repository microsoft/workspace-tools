import { getChanges } from "../git";
import { getWorkspaces } from "./getWorkspaces";

export function getChangedPackages(branch: string, cwd: string) {
  const workspaceInfo = getWorkspaces(cwd);
  const changes = getChanges(branch, cwd);
  const changeSet = new Set<string>();

  if (!changes) {
    return [];
  }

  for (const change of changes) {
    const found = workspaceInfo.find(
      (pkgPath) => change.indexOf(pkgPath.path) === 0
    );
    if (found) {
      changeSet.add(found.name);
    }
  }

  return [...changeSet];
}
